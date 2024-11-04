import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { admin, adminAuth, adminDb } from "./firebase/firebaseAdmin";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
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
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        if (token.sub) {
          session.user.id = token.sub;

          const firebaseToken = await adminAuth.createCustomToken(token.sub);
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
