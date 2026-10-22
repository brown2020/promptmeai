import { getIdToken } from "firebase/auth";
import { setCookie } from "cookies-next";
import { auth } from "@/firebase/firebaseClient";

const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "authToken";

/** Writes a fresh ID token to the cookie that server actions verify. */
export async function settleSessionCookie(): Promise<void> {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) throw new Error("No user after auth");
  const token = await getIdToken(firebaseUser, true);
  setCookie(COOKIE_NAME, token, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}
