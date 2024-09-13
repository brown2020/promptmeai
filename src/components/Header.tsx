"use client";
import { auth } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useInitializeStores } from "@/zustand/useInitializeStores";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import {
  signInWithCustomToken,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import Link from "next/link";
import { useEffect } from "react";

export default function Header() {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const setAuthDetails = useAuthStore((state) => state.setAuthDetails);
  const clearAuthDetails = useAuthStore((state) => state.clearAuthDetails);
  useInitializeStores();

  useEffect(() => {
    const syncAuthState = async () => {
      if (isSignedIn && user) {
        try {
          const token = await getToken({ template: "integration_firebase" });
          const userCredentials = await signInWithCustomToken(
            auth,
            token || ""
          );
          console.log("User signed in to Firebase:", userCredentials.user);

          // Update Firebase user profile
          await updateProfile(userCredentials.user, {
            displayName: user.fullName,
            photoURL: user.imageUrl,
          });
          setAuthDetails({
            uid: user.id,
            firebaseUid: userCredentials.user.uid,
            authEmail: user.emailAddresses[0].emailAddress,
            authDisplayName: user.fullName || "",
            authPhotoUrl: user.imageUrl,
            authReady: true,
            lastSignIn: serverTimestamp() as Timestamp,
          });
        } catch (error) {
          console.error("Error signing in with custom token:", error);
          clearAuthDetails();
        }
      } else {
        console.log("User is not signed in with Clerk");
        await firebaseSignOut(auth);
        clearAuthDetails();
      }
    };

    syncAuthState();
  }, [clearAuthDetails, getToken, isSignedIn, setAuthDetails, user]);

  return (
    <div className="flex justify-between flex-shrink-0 gap-3 px-4 h-14 items-center bg-blue-400 text-white sticky top-0 z-50">
      <Link href="/" className="font-medium text-xl">
        Prompt.me
      </Link>

      <div className="flex gap-2">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <Link href="/v1/chat-compare">Chat Compare</Link>
          <Link href="/v1/account">Account</Link>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
