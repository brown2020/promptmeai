"use client";

import { PropsWithChildren, useCallback, useEffect } from "react";
import { signOut as nextAuthSignOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { signInWithCustomToken } from "firebase/auth";
import useProfileStore from "@/zustand/useProfileStore";
import { useAuthStore } from "@/zustand/useAuthStore";
import { auth } from "@/firebase/firebaseClient";

const FirebaseAuthProvider = ({ children }: PropsWithChildren) => {
  const { fetchProfile } = useProfileStore();
  const { setUser, logout } = useAuthStore();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const syncFirebaseAuth = useCallback(
    async (session: Session) => {
      if (session?.firebaseToken && userId) {
        try {
          // Sign in with the custom token from NextAuth
          const userCredential = await signInWithCustomToken(
            auth,
            session.firebaseToken
          );

          // Set the user in Zustand (user is available in userCredential.user)
          setUser(userCredential.user);

          // Fetch the user profile once authenticated
          fetchProfile(userId);
        } catch (error) {
          console.error("Error signing in with custom token: ", error);
        }
      } else {
        // Sign out of both Firebase and NextAuth
        await nextAuthSignOut();
        await auth.signOut();
        logout(); // Clear the user from Zustand
      }
    },
    [fetchProfile, logout, setUser, userId]
  );

  useEffect(() => {
    if (!session) {
      logout(); // Ensure Zustand is cleared if no session
      return;
    }
    syncFirebaseAuth(session);
  }, [session, syncFirebaseAuth, logout]);

  return <>{children}</>;
};

export default FirebaseAuthProvider;
