"use client";

import { PropsWithChildren, useEffect } from "react";
import { signOut as nextAuthSignOut, useSession } from "next-auth/react";
import { signInWithCustomToken } from "firebase/auth";
import useProfileStore from "@/zustand/useProfileStore";
import { auth } from "@/firebase/firebaseClient";

const FirebaseAuthProvider = ({ children }: PropsWithChildren) => {
  const { fetchProfile, profile } = useProfileStore();
  const { data: session } = useSession();

  useEffect(() => {
    const syncAuth = async (
      firebaseToken: string | undefined,
      userId: string | undefined
    ) => {
      if (firebaseToken && userId) {
        try {
          // Sign in with the custom token from NextAuth
          await signInWithCustomToken(auth, firebaseToken);

          // Fetch the user profile once authenticated
          fetchProfile(userId);
        } catch (error) {
          console.error("Error signing in with custom token: ", error);
        }
      } else {
        // Sign out of both Firebase and NextAuth
        await nextAuthSignOut();
        await auth.signOut();
      }
    };

    // Add profile email checker to indicate the user is already authenticated
    if (session && !profile.email) {
      syncAuth(session.firebaseToken, session.user?.id);
    }
  }, [fetchProfile, profile.email, session]);

  return <>{children}</>;
};

export default FirebaseAuthProvider;
