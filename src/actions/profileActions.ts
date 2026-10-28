"use server";

import { writeApiKeys } from "@/firebase/apiKeys";
import {
  deleteUserData,
  ensureUserProfile,
  loadAuthIdentity,
} from "@/firebase/creditLedger";
import { verifyAuth } from "@/firebase/firebaseAdmin";
import { parseApiKeyUpdate } from "./inputs";

export async function ensureProfile() {
  const uid = await verifyAuth();
  await ensureUserProfile(uid, await loadAuthIdentity(uid));
}

export async function deleteAccount() {
  const uid = await verifyAuth();
  await deleteUserData(uid);
}

export async function saveApiKeys(raw: unknown) {
  const uid = await verifyAuth();
  await writeApiKeys(uid, parseApiKeyUpdate(raw));
}
