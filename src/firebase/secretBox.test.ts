import { describe, expect, it } from "vitest";
import { mergeStoredKeys } from "./apiKeys";
import { decryptSecret, encryptSecret, readEncryptionKey } from "./secretBox";

describe("secretBox", () => {
  it("round-trips a secret and ignores a missing or short key", () => {
    const key = Buffer.alloc(32, 7);
    const stored = encryptSecret("sk-test", key);
    expect(stored.startsWith("enc:v1:")).toBe(true);
    expect(decryptSecret(stored, key)).toBe("sk-test");
    expect(decryptSecret(stored, Buffer.alloc(32, 1))).toBeNull();
    expect(decryptSecret("plaintext", key)).toBeNull();

    const previous = process.env.API_KEYS_ENCRYPTION_KEY;
    delete process.env.API_KEYS_ENCRYPTION_KEY;
    expect(readEncryptionKey()).toBeNull();
    process.env.API_KEYS_ENCRYPTION_KEY = Buffer.alloc(8).toString("base64");
    expect(readEncryptionKey()).toBeNull();
    process.env.API_KEYS_ENCRYPTION_KEY = key.toString("base64");
    expect(readEncryptionKey()).toEqual(key);
    if (previous === undefined) delete process.env.API_KEYS_ENCRYPTION_KEY;
    else process.env.API_KEYS_ENCRYPTION_KEY = previous;
  });
});

describe("mergeStoredKeys", () => {
  it("keeps saved keys when a field is blank and encrypts replacements", () => {
    const next = mergeStoredKeys(
      { openAi: "enc:old", anthropic: "enc:anth", googleGenerativeAi: "" },
      { openAi: "", anthropic: " new ", googleGenerativeAi: "", clearGoogle: true },
      (plain) => `enc:${plain}`
    );
    expect(next).toEqual({
      openAi: "enc:old",
      anthropic: "enc:new",
      googleGenerativeAi: "",
    });
  });
});
