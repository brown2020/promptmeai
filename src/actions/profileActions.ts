"use server";

import { ensureUserProfile, loadAuthIdentity } from "@/firebase/creditLedger";
import { verifyAuth } from "@/firebase/firebaseAdmin";

export async function ensureProfile() {
  const uid = await verifyAuth();
  await ensureUserProfile(uid, await loadAuthIdentity(uid));
}
