/**
 * Route-protection helpers.
 *
 * Page-level protection lives in `src/proxy.ts` (server-side). The real
 * trust boundary remains the server actions (`verifyAuth`) and Firestore rules.
 */

/**
 * Routes reachable without authentication.
 *
 * `/loginfinish` must be public: the email-link sign-in flow lands there while
 * the user is still unauthenticated.
 */
export const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/loginfinish",
  "/terms",
  "/privacy",
  "/support",
] as const;

/**
 * Returns true if `pathname` is a public (no-auth-required) route.
 */
export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) =>
    path === "/"
      ? pathname === "/"
      : pathname === path || pathname.startsWith(`${path}/`)
  );
}
