import { beforeEach, describe, expect, it, vi } from "vitest";

const set = vi.fn();

vi.mock("next/headers", () => ({
  cookies: async () => ({ set }),
}));

import { POST } from "./route";

beforeEach(() => {
  set.mockClear();
  vi.unstubAllEnvs();
});

describe("POST /api/auth/logout", () => {
  it("expires only the caller's auth cookie", async () => {
    vi.stubEnv("NEXT_PUBLIC_COOKIE_NAME", "authToken");

    const response = await POST();

    expect(response.status).toBe(204);
    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith(
      "authToken",
      "",
      expect.objectContaining({
        httpOnly: true,
        maxAge: 0,
        path: "/",
        sameSite: "lax",
      })
    );
  });

  it("uses the configured cookie name and ignores any other identity", async () => {
    vi.stubEnv("NEXT_PUBLIC_COOKIE_NAME", "session");

    await POST();

    expect(set).toHaveBeenCalledWith("session", "", expect.any(Object));
    expect(set.mock.calls.some((call) => call[0] !== "session")).toBe(false);
  });
});
