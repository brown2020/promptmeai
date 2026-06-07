import { NextResponse, type NextRequest } from "next/server";
import { isPublicPath } from "@/utils/routes";

/**
 * Server-side route protection (Next.js 16 Proxy, formerly Middleware).
 *
 * Gates protected routes by requiring the Firebase auth cookie that the client
 * maintains via `useAuthToken`. This runs before the page renders, so
 * unauthenticated users are redirected to "/" instead of briefly loading a
 * protected page and being bounced client-side.
 *
 * This is a coarse presence check for routing/UX only. The authoritative
 * security boundary remains `verifyAuth()` in the server actions, which
 * cryptographically verifies the ID token with the Firebase Admin SDK before
 * any privileged work (AI generation, Stripe) is performed.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || "authToken";
  const hasAuthCookie = Boolean(request.cookies.get(cookieName)?.value);

  if (!hasAuthCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

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
