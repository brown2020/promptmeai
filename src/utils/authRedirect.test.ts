import { describe, expect, it } from "vitest";
import {
  authGateDecision,
  returnPathFrom,
  safeReturnPath,
  signInHref,
} from "./authRedirect";

const settledOut = { ready: true, signedIn: false };
const settledIn = { ready: true, signedIn: true };
const restoring = { ready: false, signedIn: false };

describe("authGateDecision", () => {
  it("waits on /chat while Firebase auth is still restoring", () => {
    expect(authGateDecision("/chat", "", restoring)).toEqual({ kind: "wait" });
  });

  it("keeps a signed-in user on the page they opened", () => {
    expect(authGateDecision("/chat", "", settledIn)).toEqual({ kind: "render" });
    expect(authGateDecision("/settings", "section=keys", settledIn)).toEqual({
      kind: "render",
    });
  });

  it("sends a signed-out user to sign-in and keeps the return path", () => {
    expect(authGateDecision("/chat", "", settledOut)).toEqual({
      kind: "redirect",
      href: "/login?next=%2Fchat",
    });
    expect(authGateDecision("/chat", "tab=pinned", settledOut)).toEqual({
      kind: "redirect",
      href: "/login?next=%2Fchat%3Ftab%3Dpinned",
    });
  });

  it("sends an already signed-in visitor from the sign-in page back to next", () => {
    expect(authGateDecision("/login", "next=%2Fsettings", settledIn)).toEqual({
      kind: "redirect",
      href: "/settings",
    });
    expect(authGateDecision("/signup", "", settledIn)).toEqual({
      kind: "redirect",
      href: "/chat",
    });
  });

  it("leaves public pages alone before auth settles", () => {
    expect(authGateDecision("/", "", restoring)).toEqual({ kind: "render" });
    expect(authGateDecision("/terms", "", restoring)).toEqual({ kind: "render" });
    expect(authGateDecision("/loginfinish", "", restoring)).toEqual({ kind: "render" });
  });
});

describe("safeReturnPath", () => {
  it("accepts in-app paths and rejects open redirects", () => {
    expect(safeReturnPath("/chat")).toBe("/chat");
    expect(safeReturnPath("/settings?tab=usage")).toBe("/settings?tab=usage");
    expect(safeReturnPath("https://evil.example/chat")).toBe("/chat");
    expect(safeReturnPath("//evil.example")).toBe("/chat");
    expect(safeReturnPath("/\\evil.example")).toBe("/chat");
    expect(safeReturnPath("/%2F%2Fevil.example")).toBe("/chat");
    expect(safeReturnPath("/login")).toBe("/chat");
    expect(safeReturnPath("/login?next=/chat")).toBe("/chat");
    expect(safeReturnPath("/signup/extra")).toBe("/chat");
    expect(returnPathFrom("?next=%2Fchat%3Ftab%3Dpinned")).toBe("/chat?tab=pinned");
    expect(signInHref("/payment-success", "payment_intent=pi_1")).toBe(
      "/login?next=%2Fpayment-success%3Fpayment_intent%3Dpi_1"
    );
  });
});
