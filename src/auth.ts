import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { admin, adminAuth, adminDb } from "./firebase/firebaseAdmin";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnChat = nextUrl.pathname.startsWith("/chat");
      if (isOnChat) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/chat", nextUrl));
      }
      return true;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        if (token.sub) {
          const uid = token.sub;
          const email = session.user.email;

          session.user.id = uid;

          const findUser = await admin.auth().getUser(uid);

          if (findUser) {
            if (findUser.email !== email) {
              // Update user email
              await admin.auth().updateUser(uid, {
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
  ...authConfig,
});
