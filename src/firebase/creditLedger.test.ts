import { beforeEach, describe, expect, it, vi } from "vitest";

const store = vi.hoisted(() => new Map<string, Record<string, unknown>>());

vi.mock("@/firebase/firebaseAdmin", () => {
  const snap = (path: string) => ({
    exists: store.has(path),
    data: () => store.get(path),
  });
  const doc = (path: string) => ({
    path,
    get: async () => snap(path),
    delete: async () => void store.delete(path),
  });
  return {
    adminAuth: {
      deleteUser: vi.fn(async (uid: string) => void store.set(`auth/${uid}`, { deleted: true })),
      getUser: vi.fn(async () => ({
        email: "new@example.test",
        displayName: "",
        photoURL: "",
        emailVerified: false,
      })),
    },
    adminDb: {
      doc,
      collection: (path: string) => ({ path }),
      recursiveDelete: async (ref: { path: string }) => {
        for (const key of [...store.keys()]) if (key.startsWith(`${ref.path}/`)) store.delete(key);
      },
      runTransaction: async (
        fn: (t: {
          get: (r: { path: string }) => Promise<ReturnType<typeof snap>>;
          set: (r: { path: string }, v: Record<string, unknown>) => void;
          update: (r: { path: string }, v: Record<string, unknown>) => void;
        }) => Promise<unknown>
      ) =>
        fn({
          get: async (r) => snap(r.path),
          set: (r, v) => void store.set(r.path, { ...v }),
          update: (r, v) => void store.set(r.path, { ...store.get(r.path), ...v }),
        }),
    },
  };
});

import { deleteUserData, hasCreditsAvailable, SIGNUP_CREDITS } from "./creditLedger";

beforeEach(() => store.clear());

describe("hasCreditsAvailable", () => {
  it("creates a missing profile with the signup bonus before checking", async () => {
    await expect(hasCreditsAvailable("u1")).resolves.toBe(true);
    expect(store.get("users/u1/profile/userData")?.credits).toBe(SIGNUP_CREDITS);
  });

  it("does not grant the bonus twice when the profile was deleted", async () => {
    store.set("users/u2/billing/state", { signupBonusGranted: true });
    await expect(hasCreditsAvailable("u2")).resolves.toBe(false);
    expect(store.get("users/u2/profile/userData")?.credits).toBe(0);
  });

  it("reports an empty balance as unavailable", async () => {
    store.set("users/u3/profile/userData", { credits: 0 });
    await expect(hasCreditsAvailable("u3")).resolves.toBe(false);
  });
});

describe("deleteUserData", () => {
  it("removes chats, profile, and sign-in but keeps payments and the bonus marker", async () => {
    store.set("promptme_chats/u4/chat/a", { userId: "u4" });
    store.set("promptme_chats/u4/chat/b", { userId: "u4" });
    store.set("promptme_chats/u5/chat/c", { userId: "u5" });
    store.set("users/u4/profile/userData", { credits: 10 });
    store.set("users/u4/payments/p1", { amount: 9999 });
    store.set("users/u4/billing/state", { signupBonusGranted: true });

    await deleteUserData("u4");

    expect(store.has("promptme_chats/u4/chat/a")).toBe(false);
    expect(store.has("promptme_chats/u4/chat/b")).toBe(false);
    expect(store.has("promptme_chats/u5/chat/c")).toBe(true);
    expect(store.has("users/u4/profile/userData")).toBe(false);
    expect(store.get("auth/u4")).toEqual({ deleted: true });
    expect(store.has("users/u4/payments/p1")).toBe(true);
    expect(store.has("users/u4/billing/state")).toBe(true);
  });
});
