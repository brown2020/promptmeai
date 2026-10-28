import type { APIKeys } from "@/zustand/useProfileStore";
import { adminDb } from "@/firebase/firebaseAdmin";
import { paths } from "@/firebase/paths";
import {
  decryptSecret,
  encryptSecret,
  isEncryptedSecret,
  readEncryptionKey,
} from "@/firebase/secretBox";

export type ApiKeyUpdate = APIKeys & {
  clearOpenAi?: boolean;
  clearAnthropic?: boolean;
  clearGoogle?: boolean;
};

const emptyKeys = (): APIKeys => ({
  openAi: "",
  anthropic: "",
  googleGenerativeAi: "",
});

const storedKeys = (value: unknown): APIKeys => {
  const record = (value ?? {}) as Partial<APIKeys>;
  return {
    openAi: typeof record.openAi === "string" ? record.openAi : "",
    anthropic: typeof record.anthropic === "string" ? record.anthropic : "",
    googleGenerativeAi:
      typeof record.googleGenerativeAi === "string" ? record.googleGenerativeAi : "",
  };
};

/** Blank fields keep the saved value. A clear flag removes that provider's key. */
export function mergeStoredKeys(
  current: APIKeys,
  incoming: ApiKeyUpdate,
  encrypt: (plain: string) => string
): APIKeys {
  const field = (value: string, clear: boolean | undefined, previous: string) => {
    if (clear) return "";
    const next = value.trim();
    return next ? encrypt(next) : previous;
  };
  return {
    openAi: field(incoming.openAi, incoming.clearOpenAi, current.openAi),
    anthropic: field(incoming.anthropic, incoming.clearAnthropic, current.anthropic),
    googleGenerativeAi: field(
      incoming.googleGenerativeAi,
      incoming.clearGoogle,
      current.googleGenerativeAi
    ),
  };
}

async function rewriteEncrypted(uid: string, field: keyof APIKeys, plain: string, key: Buffer) {
  await adminDb.doc(paths.userProfile(uid)).update({
    [`APIKeys.${field}`]: encryptSecret(plain, key),
  });
}

async function resolveField(
  uid: string,
  field: keyof APIKeys,
  stored: string,
  key: Buffer
): Promise<string> {
  if (!stored) return "";
  if (!isEncryptedSecret(stored)) {
    await rewriteEncrypted(uid, field, stored, key);
    return stored;
  }
  const plain = decryptSecret(stored, key);
  if (plain === null) {
    throw new Error("API key storage is not configured");
  }
  return plain;
}

/** Provider keys for a generation. Refuses to use plaintext when encryption is unset. */
export async function loadDecryptedApiKeys(uid: string): Promise<APIKeys> {
  const key = readEncryptionKey();
  if (!key) throw new Error("API key storage is not configured");

  const snapshot = await adminDb.doc(paths.userProfile(uid)).get();
  const current = storedKeys(snapshot.data()?.APIKeys);
  return {
    openAi: await resolveField(uid, "openAi", current.openAi, key),
    anthropic: await resolveField(uid, "anthropic", current.anthropic, key),
    googleGenerativeAi: await resolveField(
      uid,
      "googleGenerativeAi",
      current.googleGenerativeAi,
      key
    ),
  };
}

export async function writeApiKeys(uid: string, incoming: ApiKeyUpdate): Promise<void> {
  const key = readEncryptionKey();
  if (!key) throw new Error("API key storage is not configured");

  const ref = adminDb.doc(paths.userProfile(uid));
  const snapshot = await ref.get();
  if (!snapshot.exists) throw new Error("Profile not found");

  const next = mergeStoredKeys(storedKeys(snapshot.data()?.APIKeys), incoming, (plain) =>
    encryptSecret(plain, key)
  );
  await ref.update({ APIKeys: next });
}

export { emptyKeys };
