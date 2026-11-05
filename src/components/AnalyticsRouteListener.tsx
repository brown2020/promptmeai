"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  analyticsPagePath,
  subscribeAnalyticsConsent,
} from "@/firebase/analyticsConsent";
import {
  getAnalyticsConsentSnapshot,
  getServerAnalyticsConsentSnapshot,
  logAnalyticsPageView,
} from "@/firebase/analyticsClient";

/** Logs a GA4 page_view after cookie consent, including later client navigations. */
export default function AnalyticsRouteListener() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const hasConsent = useSyncExternalStore(
    subscribeAnalyticsConsent,
    getAnalyticsConsentSnapshot,
    getServerAnalyticsConsentSnapshot
  );
  const loggedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!hasConsent) return;
    const pagePath = analyticsPagePath(pathname, search);
    if (loggedPath.current === pagePath) return;
    loggedPath.current = pagePath;
    let cancelled = false;
    void logAnalyticsPageView(pagePath).then((didLog) => {
      if (!didLog && !cancelled && loggedPath.current === pagePath) {
        loggedPath.current = null;
      }
    });
    return () => {
      cancelled = true;
    };
  }, [hasConsent, pathname, search]);

  return null;
}
