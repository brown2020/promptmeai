"use server";

import {
  deleteUserData,
  ensureUserProfile,
  loadAuthIdentity,
} from "@/firebase/creditLedger";
import { verifyAuth } from "@/firebase/firebaseAdmin";

export async function ensureProfile() {
  const uid = await verifyAuth();
  await ensureUserProfile(uid, await loadAuthIdentity(uid));
}

export async function deleteAccount() {
  const uid = await verifyAuth();
  await deleteUserData(uid);
}
