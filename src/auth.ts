import NextAuth from "next-auth";
import authClientConfig from "./auth.client-config";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { admin, adminAuth, adminDb } from "./firebase/firebaseAdmin";
import Credentials from "next-auth/providers/credentials";
import { OAuthProviders } from "./auth.providers";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth as firebaseAuth } from "./firebase/firebaseClient";
import { FirebaseError } from "firebase/app";

const getUserById = async (userId: string) => {
  try {
    const userDoc = await adminDb.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      console.log("No user found with the given ID.");
      return null;
    }

    // Access the user data
    const userData = userDoc.data();
    return userData;
  } catch (error) {
    console.error("Error getting user document: ", error);
    throw error;
  }
};

const updateUserName = async (userId: string, name: string) => {
  try {
    // Update the user's display name in Firebase Authentication
    await admin.auth().updateUser(userId, { displayName: name });

    // Update the user's document in the Firestore `users` collection
    const userDocRef = adminDb.collection("users").doc(userId);
    await userDocRef.update({ name: name });
  } catch (error) {
    console.error("Error update user name: ", error);
    throw error;
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authClientConfig,
  providers: [
    ...OAuthProviders,
    Credentials({
      id: "email-link",
      name: "Email Link",
      credentials: {
        email: { label: "Email", type: "text" },
        accessToken: { label: "Access Token", type: "text" },
      },
      authorize: async (credentials) => {
        const { email, accessToken } = credentials;

        try {
          const decodedToken = await admin
            .auth()
            .verifyIdToken(accessToken as string);

          if (decodedToken && decodedToken.email === email) {
            const user = await getUserById(decodedToken.uid);

            if (user) {
              return {
                id: decodedToken.uid,
                name: user.name,
                email: user.email,
              };
            } else {
              throw new Error("User not found.");
            }
          } else {
            throw new Error("Invalid credentials.");
          }
        } catch (error) {
          console.error("Failed to decode the credit token", error);
          throw new Error("Invalid credentials.");
        }
      },
    }),
    Credentials({
      id: "login-password",
      name: "Login Password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "text" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        try {
          const userCredential = await signInWithEmailAndPassword(
            firebaseAuth,
            email as string,
            password as string
          );

          const user = userCredential.user;

          return {
            id: user.uid,
            name: user.displayName || "",
            email: user.email,
            image: user.photoURL || "",
          };
        } catch (error) {
          if (error instanceof FirebaseError) {
            // Handle Firebase specific errors
            switch (error.code) {
              case "auth/invalid-credential":
                throw new Error(
                  "Invalid credentials. Please check and try again."
                );
              case "auth/wrong-password":
                throw new Error("Incorrect password. Please try again.");
              default:
                throw new Error(
                  "Something went wrong. Please try again later."
                );
            }
          } else {
            // Handle non-Firebase errors
            console.error("Unexpected error:", error);
            throw new Error(
              "An unexpected error occurred. Please try again later."
            );
          }
        }
      },
    }),
    Credentials({
      id: "account-register",
      name: "Account Register",
      credentials: {
        name: { label: "Full name", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "text" },
      },
      authorize: async (credentials) => {
        const { name, email, password } = credentials;

        try {
          const userCredential = await createUserWithEmailAndPassword(
            firebaseAuth,
            email as string,
            password as string
          );

          const user = userCredential.user;

          const findUser = await getUserById(user.uid);

          if (findUser) {
            await updateUserName(findUser.id, String(name));
          }

          return {
            id: user.uid,
            name: user.displayName || String(name) || "",
            email: user.email,
            image: user.photoURL || "",
          };
        } catch (error) {
          if (error instanceof FirebaseError) {
            // Handle Firebase specific errors
            console.log("error code", error.code);
            switch (error.code) {
              case "auth/email-already-in-use":
                throw new Error(
                  "This email is already registered. Please sign in or use a different email."
                );
              case "auth/weak-password":
                throw new Error(
                  "Your password is too weak. Please choose a stronger password."
                );
              default:
                throw new Error(
                  "Something went wrong. Please try again later."
                );
            }
          } else {
            // Handle non-Firebase errors
            console.error("Unexpected error:", error);
            throw new Error("An unexpected error occurred. Please try again.");
          }
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    ...authClientConfig.callbacks,
    jwt: async ({ user, token }) => {
      if (user) {
        token.sub = user.id;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        if (token.sub) {
          const uid = token.sub;
          const email = session.user.email;

          session.user.id = uid;

          try {
            const findUser = await admin.auth().getUserByEmail(email);

            if (findUser) {
              if (findUser.uid !== uid) {
                // Replace old user with new user from AuthJS integration
                await admin.auth().deleteUser(findUser.uid);
                await admin.auth().createUser({
                  uid,
                  email,
                });
              }
            } else {
              // Create the user with both uid and email set from the start
              await admin.auth().createUser({
                uid,
                email,
              });
            }

            const firebaseToken = await adminAuth.createCustomToken(uid);

            session.firebaseToken = firebaseToken;
          } catch (error) {
            console.error("Failed to find user", error);
          }
        }
      }

      return session;
    },
  },
  adapter: FirestoreAdapter(adminDb),
});
