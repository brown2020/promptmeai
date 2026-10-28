"use server";

import { cookies } from "next/headers";
import { adminAuth, hasAdminConfig } from "@/firebase/firebaseAdmin";
import { sessionCookieOptions } from "@/firebase/sessionCookieOptions";

const cookieName = () => process.env.NEXT_PUBLIC_COOKIE_NAME || "authToken";

/** Verifies the ID token, then stores it in an HttpOnly cookie. */
export async function establishSession(idToken: string) {
  if (!hasAdminConfig || typeof adminAuth.verifyIdToken !== "function") {
    throw new Error("Unauthorized: Auth not configured");
  }
  if (typeof idToken !== "string" || idToken.length === 0 || idToken.length > 8192) {
    throw new Error("Unauthorized: Invalid auth token");
  }
  await adminAuth.verifyIdToken(idToken);
  const store = await cookies();
  store.set(
    cookieName(),
    idToken,
    sessionCookieOptions(process.env.NODE_ENV === "production")
  );
}

