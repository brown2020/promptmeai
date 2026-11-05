import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 16 Proxy (formerly Middleware).
 *
 * This used to redirect protected routes to "/" when the auth cookie was
 * missing. That ran before the browser could restore Firebase Auth, so a
 * signed-in user opening /chat directly was sent home: the cookie is written
 * only after that restore, and it expires while the Firebase sign-in remains.
 *
 * `AuthGate` waits for that restore, keeps a signed-in user on the URL they
 * opened, and sends a signed-out user to /login with the path in `next`.
 * `verifyAuth()` is still the trust boundary for server actions.
 */
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  /*
   * Run on all request paths except Next.js internals and static assets:
   * - _next/static, _next/image (framework internals)
   * - favicon.ico, icon.svg (favicons)
   * - any path containing a dot (static files: .svg, .png, .css, .js, ...)
   */
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\..*).*)"],
};
