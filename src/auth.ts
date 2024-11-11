import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { admin, adminAuth, adminDb } from "./firebase/firebaseAdmin";
import type { Provider } from "next-auth/providers";

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

      console.log("proccess email", email);
      console.log("proccess accessToken", accessToken);

      try {
        const decodedToken = await admin
          .auth()
          .verifyIdToken(accessToken as string);

        console.log("Token verified successfully", decodedToken);

        return null;
      } catch (error) {
        console.error("Error verifying token:", error);
        throw error;
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

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        if (token.sub) {
          session.user.id = token.sub;

          const additionalClaims = {
            email: token.email,
          };

          const firebaseToken = await adminAuth.createCustomToken(
            token.sub,
            additionalClaims
          );

          session.firebaseToken = firebaseToken;
        }
      }

      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.sub = user.id;
      }

      return token;
    },
  },
  adapter: FirestoreAdapter(adminDb),
});
