import type { NextAuthConfig } from "next-auth";
import { admin, adminDb } from "./firebase/firebaseAdmin";
import { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

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

const providers: Provider[] = [
  Google,
  Credentials({
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
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export default {
  providers,
} satisfies NextAuthConfig;
