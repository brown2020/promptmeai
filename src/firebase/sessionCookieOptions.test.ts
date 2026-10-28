import { describe, expect, it } from "vitest";
import { sessionCookieOptions } from "./sessionCookieOptions";

describe("sessionCookieOptions", () => {
  it("keeps the ID token out of document.cookie", () => {
    expect(sessionCookieOptions(true)).toMatchObject({
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
    expect(sessionCookieOptions(false).secure).toBe(false);
  });
});
