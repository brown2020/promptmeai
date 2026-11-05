/** Cookie name and accept value written by `react-cookie-consent` defaults. */
export const ANALYTICS_CONSENT_COOKIE = "CookieConsent";
export const ANALYTICS_CONSENT_VALUE = "true";

const listeners = new Set<() => void>();

export function isAnalyticsConsentGranted(cookieValue: string | undefined): boolean {
  return cookieValue === ANALYTICS_CONSENT_VALUE;
}

/** Path sent as GA4 `page_path`, including the query when the client route has one. */
export function analyticsPagePath(pathname: string, search: string): string {
  const query = search.startsWith("?") ? search.slice(1) : search;
  return query ? `${pathname}?${query}` : pathname;
}

export function subscribeAnalyticsConsent(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyAnalyticsConsent() {
  listeners.forEach((listener) => listener());
}
