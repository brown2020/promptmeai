import NextAuth from "next-auth";
import authClientConfig from "./auth.client-config";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { adminAuth, adminDb } from "./firebase/firebaseAdmin";
import { OAuthProviders } from "./auth.providers";
import { AuthCredentials } from "./auth.credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authClientConfig,
  providers: [...OAuthProviders, ...AuthCredentials],
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
            const findUser = await adminAuth.getUserByEmail(email);

            if (findUser) {
              if (findUser.uid !== uid) {
                // Replace old user with new user from AuthJS integration
                await adminAuth.deleteUser(findUser.uid);
                await adminAuth.createUser({
                  uid,
                  email,
                });
              }
            } else {
              // Create the user with both uid and email set from the start
              await adminAuth.createUser({
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
