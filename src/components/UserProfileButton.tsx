"use client";

import { auth } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useInitializeStores } from "@/zustand/useInitializeStores";
import { SignInButton, useAuth, UserButton, useUser } from "@clerk/nextjs";
import { signInWithCustomToken, signOut, updateProfile } from "firebase/auth";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import { useEffect } from "react";
import { FaUserAstronaut } from "react-icons/fa6";

const UserProfileButton = () => {
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
        await signOut(auth);
        clearAuthDetails();
      }
    };

    syncAuthState();
  }, [clearAuthDetails, getToken, isSignedIn, setAuthDetails, user]);

  return isSignedIn ? (
    <UserButton />
  ) : (
    <SignInButton forceRedirectUrl="/chat" mode="modal">
      <FaUserAstronaut size={24} color="#255148" />
    </SignInButton>
  );
};

export default UserProfileButton;
