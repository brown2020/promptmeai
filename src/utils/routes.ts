/**
 * Route-protection helpers.
 *
 * The client auth gate (`AuthGate`) waits until Firebase Auth has settled.
 * Signed-in visitors stay on the URL they opened. Signed-out visitors go to
 * `/login` with that URL in `next`. The proxy does not redirect on a missing
 * cookie. The trust boundary remains `verifyAuth()` and the Firestore rules.
 */

/**
 * Routes reachable without authentication.
 *
 * `/loginfinish` must be public: the email-link sign-in flow lands there while
 * the user is still unauthenticated.
 * `/api/stripe/webhook` must be public: Stripe calls it with a signature, not a session cookie.
 * `/api/auth/logout` must be public: it only expires the caller's own cookie, including
 * when that cookie's ID token is already missing or invalid.
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
  "/api/stripe/webhook",
  "/api/auth/logout",
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
