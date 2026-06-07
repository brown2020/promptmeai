/**
 * Route-protection helpers.
 *
 * Page-level protection in this app is client-side (see `app/providers.tsx`):
 * unauthenticated users are redirected away from non-public routes. The real
 * trust boundary remains the server actions (`verifyAuth`) and Firestore rules.
 *
 * Keep this logic pure so it can be unit-tested independently of React/Firebase.
 */

/**
 * Routes reachable without authentication.
 *
 * `/loginfinish` must be public: the email-link sign-in flow lands there while
 * the user is still unauthenticated, so gating it would redirect the user away
 * before sign-in can complete.
 */
export const PUBLIC_PATHS = [
  "/",
  "/loginfinish",
  "/terms",
  "/privacy",
  "/support",
] as const;

/**
 * Returns true if `pathname` is a public (no-auth-required) route.
 *
 * Matching is exact, or a path-segment-bounded prefix (e.g. `/terms` matches
 * `/terms/foo` but not `/terms-of-service`). The root `/` matches exactly only.
 */
export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) =>
    path === "/"
      ? pathname === "/"
      : pathname === path || pathname.startsWith(`${path}/`)
  );
}
