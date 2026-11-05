import { describe, expect, it } from "vitest";
import { defaultCookieConsentName } from "react-cookie-consent";
import {
  ANALYTICS_CONSENT_COOKIE,
  ANALYTICS_CONSENT_VALUE,
  analyticsPagePath,
  isAnalyticsConsentGranted,
  notifyAnalyticsConsent,
  subscribeAnalyticsConsent,
} from "./analyticsConsent";

describe("analytics consent", () => {
  it("matches the cookie the existing banner writes on accept", () => {
    expect(ANALYTICS_CONSENT_COOKIE).toBe(defaultCookieConsentName);
    expect(ANALYTICS_CONSENT_VALUE).toBe("true");
  });

  it("starts analytics only after the accept value is stored", () => {
    expect(isAnalyticsConsentGranted(undefined)).toBe(false);
    expect(isAnalyticsConsentGranted("")).toBe(false);
    expect(isAnalyticsConsentGranted("false")).toBe(false);
    expect(isAnalyticsConsentGranted("TRUE")).toBe(false);
    expect(isAnalyticsConsentGranted("true")).toBe(true);
  });

  it("notifies subscribers when consent is accepted", () => {
    let calls = 0;
    const stop = subscribeAnalyticsConsent(() => {
      calls += 1;
    });
    notifyAnalyticsConsent();
    expect(calls).toBe(1);
    stop();
    notifyAnalyticsConsent();
    expect(calls).toBe(1);
  });
});

describe("analytics page path", () => {
  it("keeps a path without a query", () => {
    expect(analyticsPagePath("/chat", "")).toBe("/chat");
  });

  it("appends a client query string once", () => {
    expect(analyticsPagePath("/chat", "tab=pinned")).toBe("/chat?tab=pinned");
    expect(analyticsPagePath("/chat", "?tab=pinned")).toBe("/chat?tab=pinned");
  });
});
