import { isPublicPath } from "@/utils/routes";

/**
 * Where to send the browser once Firebase Auth has settled.
 * A missing cookie is not a decision: the cookie is written only after restore.
 */

export type AuthGateDecision =
  | { kind: "render" }
  | { kind: "wait" }
  | { kind: "redirect"; href: string };

const FALLBACK = "/chat";

function isAuthEntry(pathname: string): boolean {
  return pathname === "/login" || pathname === "/signup";
}

/** Same-origin path only. Anything else becomes the chat page. */
export function safeReturnPath(raw: string | null | undefined): string {
  if (!raw) return FALLBACK;
  const value = raw.trim();
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return FALLBACK;
  }
  if (value.includes("\\") || value.includes("://")) return FALLBACK;

  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return FALLBACK;
  }
  if (/[\u0000-\u001F\u007F]/.test(value) || /[\u0000-\u001F\u007F]/.test(decoded)) {
    return FALLBACK;
  }
  if (
    !decoded.startsWith("/") ||
    decoded.startsWith("//") ||
    decoded.includes("\\") ||
    decoded.includes("://")
  ) {
    return FALLBACK;
  }
  if (/^\/(login|signup|forgot-password)(\/|$|\?)/.test(decoded)) return FALLBACK;
  return value;
}

/** `search` is the query string with or without a leading `?`. */
export function returnPathFrom(search: string): string {
  const query = search.startsWith("?") ? search.slice(1) : search;
  return safeReturnPath(new URLSearchParams(query).get("next"));
}

export function signInHref(pathname: string, search: string): string {
  const query = search ? (search.startsWith("?") ? search : `?${search}`) : "";
  const next = safeReturnPath(`${pathname}${query}`);
  return `/login?next=${encodeURIComponent(next)}`;
}

export function authGateDecision(
  pathname: string,
  search: string,
  auth: { ready: boolean; signedIn: boolean }
): AuthGateDecision {
  if (isAuthEntry(pathname)) {
    if (!auth.ready) return { kind: "wait" };
    if (auth.signedIn) return { kind: "redirect", href: returnPathFrom(search) };
    return { kind: "render" };
  }
  if (isPublicPath(pathname)) return { kind: "render" };
  if (!auth.ready) return { kind: "wait" };
  if (auth.signedIn) return { kind: "render" };
  return { kind: "redirect", href: signInHref(pathname, search) };
}
