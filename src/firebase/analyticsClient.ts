"use client";

import { getApp, getApps } from "firebase/app";
import type { Analytics } from "firebase/analytics";
import { getCookieConsentValue } from "react-cookie-consent";
import {
  ANALYTICS_CONSENT_COOKIE,
  isAnalyticsConsentGranted,
} from "@/firebase/analyticsConsent";
import { hasClientConfig } from "@/firebase/firebaseClient";
import { logger } from "@/utils/logger";

export function getAnalyticsConsentSnapshot(): boolean {
  return isAnalyticsConsentGranted(getCookieConsentValue(ANALYTICS_CONSENT_COOKIE));
}

export function getServerAnalyticsConsentSnapshot(): boolean {
  return false;
}

let analyticsPromise: Promise<Analytics | null> | null = null;

/**
 * Starts Firebase Analytics once the visitor has accepted cookies.
 * Automatic page views are off so route changes are logged once, by us.
 */
export function startAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined" || !hasClientConfig || getApps().length === 0) {
    return Promise.resolve(null);
  }
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID?.trim();
  if (!measurementId) return Promise.resolve(null);
  if (!analyticsPromise) {
    analyticsPromise = createAnalytics().catch((error: unknown) => {
      analyticsPromise = null;
      logger.warn("[analytics] init failed", error);
      return null;
    });
  }
  return analyticsPromise;
}

async function createAnalytics(): Promise<Analytics | null> {
  const { getAnalytics, initializeAnalytics, isSupported } = await import(
    "firebase/analytics"
  );
  if (!(await isSupported())) return null;
  const app = getApp();
  try {
    initializeAnalytics(app, { config: { send_page_view: false } });
  } catch {
    // Already initialized after a hot reload.
  }
  return getAnalytics(app);
}

export async function logAnalyticsPageView(pagePath: string): Promise<boolean> {
  const analytics = await startAnalytics();
  if (!analytics || !pagePath) return false;
  const { logEvent } = await import("firebase/analytics");
  logEvent(analytics, "page_view", {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  });
  return true;
}
