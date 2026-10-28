import { getIdToken } from "firebase/auth";
import { establishSession } from "@/actions/sessionActions";
import { auth } from "@/firebase/firebaseClient";

/** Writes a fresh ID token into the HttpOnly cookie that server actions verify. */
export async function settleSessionCookie(): Promise<void> {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) throw new Error("No user after auth");
  const token = await getIdToken(firebaseUser, true);
  await establishSession(token);
}
