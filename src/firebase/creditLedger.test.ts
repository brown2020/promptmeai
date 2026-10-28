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
      collection: (path: string) => ({
        path,
        doc: (id?: string) => doc(`${path}/${id ?? `auto${store.size + 1}`}`),
      }),
      recursiveDelete: async (ref: { path: string }) => {
        for (const key of [...store.keys()]) {
          if (key === ref.path || key.startsWith(`${ref.path}/`)) store.delete(key);
        }
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

import {
  deleteUserData,
  grantCatalogCredits,
  hasCreditsAvailable,
  refundCredits,
  reserveCredits,
  SIGNUP_CREDITS,
} from "./creditLedger";

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

describe("reserveCredits", () => {
  it("rejects a hold the balance cannot cover and leaves the balance unchanged", async () => {
    store.set("users/u6/profile/userData", { credits: 10 });
    await expect(reserveCredits("u6", 11)).resolves.toBe(false);
    expect(store.get("users/u6/profile/userData")?.credits).toBe(10);
  });

  it("debits the full hold up front", async () => {
    store.set("users/u7/profile/userData", { credits: 40 });
    await expect(reserveCredits("u7", 33)).resolves.toBe(true);
    expect(store.get("users/u7/profile/userData")?.credits).toBe(7);
  });

  it("returns an unused hold without dropping below the remainder", async () => {
    store.set("users/u8/profile/userData", { credits: 7 });
    await refundCredits("u8", 33);
    expect(store.get("users/u8/profile/userData")?.credits).toBe(40);
  });
});

describe("grantCatalogCredits", () => {
  it("grants once even if the client already wrote a payment row", async () => {
    store.set("users/u9/profile/userData", { credits: 5, totalCredits: 5 });
    store.set("users/u9/payments/client", { id: "pi_abc", status: "succeeded" });

    const first = await grantCatalogCredits("u9", "pi_abc", 9999);
    const second = await grantCatalogCredits("u9", "pi_abc", 9999);

    expect(first).toMatchObject({ alreadyProcessed: false, credits: 10_005 });
    expect(second).toMatchObject({ alreadyProcessed: true, credits: 10_005 });
    expect(store.get("users/u9/billing/grants/pi_abc")).toMatchObject({
      paymentIntentId: "pi_abc",
    });
  });

  it("rejects a non-catalog amount before writing", async () => {
    store.set("users/u10/profile/userData", { credits: 1, totalCredits: 1 });
    await expect(grantCatalogCredits("u10", "pi_bad", 100)).rejects.toThrow(
      "Invalid payment amount"
    );
    expect(store.get("users/u10/profile/userData")?.credits).toBe(1);
    expect(store.has("users/u10/billing/grants/pi_bad")).toBe(false);
  });
});

describe("deleteUserData", () => {
  it("removes everything stored for the user and the sign-in, and nothing of other users", async () => {
    store.set("promptme_chats/u4", { userId: "u4" });
    store.set("promptme_chats/u4/chat/a", { userId: "u4" });
    store.set("promptme_chats/u4/chat/b", { userId: "u4" });
    store.set("promptme_chats/u5/chat/c", { userId: "u5" });
    store.set("users/u4", { email: "u4@example.test", lastSignIn: 1 });
    store.set("users/u4/profile/userData", { credits: 10 });
    store.set("users/u4/payments/p1", { amount: 9999 });
    store.set("users/u4/billing/state", { signupBonusGranted: true });
    store.set("users/u4/generations/r1", { cancelled: true });
    store.set("users/u5/profile/userData", { credits: 5 });

    await deleteUserData("u4");

    expect([...store.keys()].filter((key) => key.includes("u4") && !key.startsWith("auth/"))).toEqual([]);
    expect(store.get("auth/u4")).toEqual({ deleted: true });
    expect(store.has("promptme_chats/u5/chat/c")).toBe(true);
    expect(store.has("users/u5/profile/userData")).toBe(true);
  });
});
