"use client";

import { redirect, RedirectType, usePathname, useSearchParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import Spinner from "@/components/Spinner";
import {
  getAuthSnapshot,
  getServerAuthSnapshot,
  subscribeAuth,
} from "@/firebase/authSnapshot";
import { hasClientConfig } from "@/firebase/firebaseClient";
import { authGateDecision } from "@/utils/authRedirect";

export function AuthChecking() {
  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <Spinner message="Checking sign-in…" />
    </div>
  );
}

/**
 * Decides protected routes only after Firebase Auth has restored.
 * Until then the URL stays put, so a signed-in direct visit to /chat is not
 * bounced home while the session cookie is still missing.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const snapshot = useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getServerAuthSnapshot
  );

  if (!hasClientConfig) return children;

  const decision = authGateDecision(pathname, searchParams.toString(), {
    ready: snapshot.ready,
    signedIn: snapshot.user !== null,
  });

  if (decision.kind === "wait") return <AuthChecking />;
  if (decision.kind === "redirect") redirect(decision.href, RedirectType.replace);
  return children;
}
