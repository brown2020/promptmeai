"use client";

import { useAuthStore } from "@/zustand/useAuthStore";
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  updateProfile as updateAuthProfile,
} from "firebase/auth";
import { auth, hasClientConfig } from "@/firebase/firebaseClient";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import toast from "react-hot-toast";
import { mapAuthError } from "@/utils/authErrors";
import { establishSession } from "@/actions/sessionActions";
import { getIdToken } from "firebase/auth";

export default function LoginFinishPage() {
  const setAuthDetails = useAuthStore((s) => s.setAuthDetails);
  const [status, setStatus] = useState("Completing sign in…");
  const [destination, setDestination] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function attemptSignIn() {
      try {
        if (!hasClientConfig) {
          throw new Error("Authentication is not configured");
        }
        if (!isSignInWithEmailLink(auth, window.location.href)) {
          throw new Error("Sign in link is not valid");
        }

        let email = window.localStorage.getItem("promptmeEmail");
        const name = window.localStorage.getItem("promptmeName") || "";

        if (!email) {
          email = window.prompt("Please confirm your email");
          if (!email) {
            throw new Error("Email confirmation cancelled by user");
          }
        }

        const userCredential = await signInWithEmailLink(
          auth,
          email,
          window.location.href
        );

        const user = userCredential.user;
        const authEmail = user?.email;
        const uid = user?.uid;
        const selectedName = name || user?.displayName || "";

        if (!uid || !authEmail) {
          throw new Error("No user found");
        }

        const token = await getIdToken(user, true);
        await establishSession(token);

        if (cancelled) return;

        setAuthDetails({
          uid,
          authEmail,
          authDisplayName: selectedName,
          authReady: true,
          authPending: false,
        });
        if (selectedName && selectedName !== user.displayName) {
          await updateAuthProfile(user, { displayName: selectedName });
        }
        if (cancelled) return;
        setStatus("Redirecting…");
        setDestination("/chat");
      } catch (error) {
        const errorMessage = mapAuthError(error);
        console.warn("[auth] loginfinish-failed");
        if (!cancelled) {
          toast.error(errorMessage);
          setStatus(errorMessage);
          setDestination("/");
        }
      } finally {
        window.localStorage.removeItem("promptmeEmail");
        window.localStorage.removeItem("promptmeName");
      }
    }

    void attemptSignIn();
    return () => {
      cancelled = true;
    };
  }, [setAuthDetails]);

  if (destination) redirect(destination);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Spinner message={destination ? `Opening ${destination}` : status} />
    </div>
  );
}
