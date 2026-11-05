import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy, config } from "./proxy";

const COOKIE = process.env.NEXT_PUBLIC_COOKIE_NAME || "authToken";

function request(path: string, withCookie = false) {
  const req = new NextRequest(`https://example.com${path}`);
  if (withCookie) req.cookies.set(COOKIE, "fake-token");
  return req;
}

describe("proxy route protection", () => {
  it("does not redirect /chat before the client can restore a signed-in user", () => {
    const res = proxy(request("/chat"));
    expect(res.status).not.toBe(307);
    expect(res.headers.get("location")).toBeNull();
  });

  it("allows authenticated requests for protected routes", () => {
    const res = proxy(request("/chat", true));
    expect(res.headers.get("location")).toBeNull();
  });

  it("allows public routes without a cookie", () => {
    for (const path of ["/", "/terms", "/loginfinish", "/api/stripe/webhook", "/api/auth/logout"]) {
      const res = proxy(request(path));
      expect(res.headers.get("location")).toBeNull();
    }
  });

  it("excludes Next internals and static assets from the matcher", () => {
    expect(config.matcher).toEqual([
      "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\..*).*)",
    ]);
  });
});
