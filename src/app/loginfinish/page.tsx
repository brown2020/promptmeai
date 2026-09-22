"use client";

import { useAuthStore } from "@/zustand/useAuthStore";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth, hasClientConfig } from "@/firebase/firebaseClient";
import { useEffect, useState } from "react";
import useProfileStore from "@/zustand/useProfileStore";
import Spinner from "@/components/Spinner";
import toast from "react-hot-toast";
import { mapAuthError } from "@/utils/authErrors";
import { setCookie } from "cookies-next";
import { getIdToken } from "firebase/auth";

const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "authToken";

export default function LoginFinishPage() {
  const setAuthDetails = useAuthStore((s) => s.setAuthDetails);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const [status, setStatus] = useState("Completing sign in...");

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
        setCookie(COOKIE_NAME, token, {
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        if (cancelled) return;

        setAuthDetails({
          uid,
          authEmail,
          authDisplayName: selectedName,
          authReady: true,
          authPending: false,
        });
        updateProfile({ displayName: selectedName });
        setStatus("Redirecting…");
        window.location.assign("/chat");
      } catch (error) {
        const errorMessage = mapAuthError(error);
        console.warn("[auth] loginfinish-failed");
        if (!cancelled) {
          toast.error(errorMessage);
          setStatus(errorMessage);
          window.location.assign("/");
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
  }, [setAuthDetails, updateProfile]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Spinner message={status} />
    </div>
  );
}
