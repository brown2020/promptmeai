import { describe, it, expect } from "vitest";
import { PUBLIC_PATHS, isPublicPath } from "./routes";

describe("isPublicPath", () => {
  it("treats the root path as public (exact match only)", () => {
    expect(isPublicPath("/")).toBe(true);
  });

  it("treats the static/legal routes as public", () => {
    expect(isPublicPath("/terms")).toBe(true);
    expect(isPublicPath("/privacy")).toBe(true);
    expect(isPublicPath("/support")).toBe(true);
  });

  it("treats /loginfinish as public so email-link sign-in can complete", () => {
    // Regression guard: gating /loginfinish redirects users away mid sign-in.
    expect(isPublicPath("/loginfinish")).toBe(true);
    expect(PUBLIC_PATHS).toContain("/loginfinish");
  });

  it("treats authenticated app routes as protected", () => {
    expect(isPublicPath("/chat")).toBe(false);
    expect(isPublicPath("/settings")).toBe(false);
    expect(isPublicPath("/payment-attempt")).toBe(false);
    expect(isPublicPath("/payment-success")).toBe(false);
  });

  it("matches nested paths under a public route by segment boundary", () => {
    expect(isPublicPath("/terms/foo")).toBe(true);
    expect(isPublicPath("/privacy/cookies")).toBe(true);
  });

  it("does not treat lookalike prefixes as public", () => {
    expect(isPublicPath("/terms-of-service")).toBe(false);
    expect(isPublicPath("/privacy-policy-hack")).toBe(false);
  });

  it("does not match the removed /about route", () => {
    expect(isPublicPath("/about")).toBe(false);
  });
});
