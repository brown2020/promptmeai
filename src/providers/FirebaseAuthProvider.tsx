"use client";

import { PropsWithChildren, useCallback, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import useProfileStore from "@/zustand/useProfileStore";

const FirebaseAuthProvider = ({ children }: PropsWithChildren) => {
  const { fetchProfile } = useProfileStore();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const syncFirebaseAuth = useCallback(
    async (session: Session) => {
      if (session && session.firebaseToken && userId) {
        try {
          await signInWithCustomToken(auth, session.firebaseToken);

          fetchProfile(userId);
        } catch (error) {
          console.error("Error signing in with custom token: ", error);
        }
      } else {
        signOut();
        auth.signOut();
      }
    },
    [fetchProfile, userId]
  );

  useEffect(() => {
    if (!session) return;

    syncFirebaseAuth(session);
  }, [session, syncFirebaseAuth]);

  return <>{children}</>;
};

export default FirebaseAuthProvider;
