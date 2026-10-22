import { beforeEach, describe, expect, it, vi } from "vitest";

const store = vi.hoisted(() => new Map<string, Record<string, unknown>>());

vi.mock("@/firebase/firebaseAdmin", () => {
  const snap = (path: string) => ({
    exists: store.has(path),
    data: () => store.get(path),
  });
  const doc = (path: string) => ({ path, get: async () => snap(path) });
  return {
    adminAuth: {
      getUser: vi.fn(async () => ({
        email: "new@example.test",
        displayName: "",
        photoURL: "",
        emailVerified: false,
      })),
    },
    adminDb: {
      doc,
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

import { hasCreditsAvailable, SIGNUP_CREDITS } from "./creditLedger";

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
