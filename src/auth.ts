import NextAuth from "next-auth";
import authClientConfig from "./auth.client-config";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { admin, adminAuth, adminDb } from "./firebase/firebaseAdmin";
import Credentials from "next-auth/providers/credentials";
import { OAuthProviders } from "./auth.providers";

async function getUserById(userId: string) {
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
    console.error("Error getting user document:", error);
    throw error;
  }
}

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
