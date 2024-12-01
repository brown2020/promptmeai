import { adminAuth } from "./firebase/firebaseAdmin";
import Credentials from "next-auth/providers/credentials";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { auth as firebaseAuth } from "./firebase/firebaseClient";
import { FirebaseError } from "firebase/app";
import {
  createUser,
  getUserById,
  updateUserName,
} from "./services/authService";
import { Provider } from "next-auth/providers";

export const AuthCredentials: Provider[] = [
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
        const decodedToken = await adminAuth.verifyIdToken(
          accessToken as string
        );

        if (decodedToken && decodedToken.email === email) {
          const userProfile = await getUserById(decodedToken.uid);

          if (userProfile) {
            return {
              id: decodedToken.uid,
              name: userProfile?.name || "",
              email: userProfile?.email || "",
              image: userProfile?.image || "",
            };
          } else {
            const newUser = {
              uid: decodedToken.uid,
              email: String(email),
              displayName: "",
              photoURL: "",
            } as User;

            await createUser(newUser);

            return {
              id: decodedToken.uid,
              email: String(email),
              name: "",
              image: "",
            };
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
        const userProfile = await getUserById(user.uid);

        return {
          id: user.uid,
          name: userProfile?.name || user?.displayName || "",
          email: userProfile?.email || user.email || "",
          image: userProfile?.image || user.photoURL || "",
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
              throw new Error("Something went wrong. Please try again later.");
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

        const user = { ...userCredential.user };
        user.displayName = String(name);

        const findUser = await getUserById(user.uid);

        if (findUser) {
          await updateUserName(findUser.id, String(name));
        } else {
          await createUser(user);
          await updateUserName(user.uid, String(name));
        }

        return {
          id: user.uid,
          name: user.displayName || "",
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
              throw new Error("Something went wrong. Please try again later.");
          }
        } else {
          // Handle non-Firebase errors
          console.error("Unexpected error:", error);
          throw new Error("An unexpected error occurred. Please try again.");
        }
      }
    },
  }),
];
