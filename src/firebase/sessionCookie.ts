import { getIdToken } from "firebase/auth";
import { establishSession } from "@/actions/sessionActions";
import { auth } from "@/firebase/firebaseClient";

/** Expires the HttpOnly auth cookie. Works when the ID token is already invalid. */
export async function clearSession(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
  });
  if (!response.ok) {
    throw new Error("Could not clear the session");
  }
}

/** Writes a fresh ID token into the HttpOnly cookie that server actions verify. */
export async function settleSessionCookie(): Promise<void> {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) throw new Error("No user after auth");
  const token = await getIdToken(firebaseUser, true);
  await establishSession(token);
}
