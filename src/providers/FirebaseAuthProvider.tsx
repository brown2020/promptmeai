"use client";

import { PropsWithChildren, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import useProfileStore from "@/zustand/useProfileStore";

const syncFirebaseAuth = async (session: Session) => {
  if (session && session.firebaseToken) {
    try {
      await signInWithCustomToken(auth, session.firebaseToken);
    } catch (error) {
      console.error("Error signing in with custom token: ", error);
    }
  } else {
    auth.signOut();
  }
};

const FirebaseAuthProvider = ({ children }: PropsWithChildren) => {
  const { fetchProfile } = useProfileStore();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!session) return;

    syncFirebaseAuth(session);

    if (userId) {
      fetchProfile(userId);
    }
  }, [fetchProfile, session, userId]);

  return <>{children}</>;
};

export default FirebaseAuthProvider;
