"use client";

import Link from "next/link";
import { deleteCookie } from "cookies-next";
import { signOut } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { auth, hasClientConfig } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";

export default function AuthComponent() {
  const uid = useAuthStore((s) => s.uid);
  const authEmail = useAuthStore((s) => s.authEmail);
  const authDisplayName = useAuthStore((s) => s.authDisplayName);
  const clearAuthDetails = useAuthStore((s) => s.clearAuthDetails);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      deleteCookie(process.env.NEXT_PUBLIC_COOKIE_NAME || "authToken", {
        path: "/",
      });
      deleteCookie("authToken", { path: "/" });
      if (hasClientConfig) {
        await signOut(auth);
      }
      clearAuthDetails();
    } catch {
      console.warn("[auth] sign-out-failed");
      toast.error("An error occurred while signing out.");
    } finally {
      setSigningOut(false);
    }
  };

  if (uid) {
    return (
      <div className="flex max-w-md flex-col items-center gap-3 mx-auto">
        <p className="text-center text-sm text-gray-700 dark:text-gray-300">
          Signed in as {authDisplayName || authEmail || "user"}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/chat" className="btn-primary">
            Open chat
          </Link>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            disabled={signingOut}
            className="btn-secondary disabled:opacity-60"
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Link href="/signup" className="btn-primary">
        Create account
      </Link>
      <Link
        href="/login"
        className="text-sm font-medium text-[#1A8F70] underline underline-offset-2"
      >
        Sign in
      </Link>
    </div>
  );
}
