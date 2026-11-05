"use client";

import { NextUIProvider } from "@nextui-org/react";
import CookieConsent from "react-cookie-consent";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import useAuthToken from "@/hooks/useAuthToken";
import { Suspense, useSyncExternalStore } from "react";
import { useInitializeStores } from "@/zustand/useInitializeStores";
import { usePlatform } from "@/zustand/usePlatformStore";
import { Toaster } from "react-hot-toast";
import AnalyticsRouteListener from "@/components/AnalyticsRouteListener";
import AuthGate, { AuthChecking } from "@/components/AuthGate";
import {
  ANALYTICS_CONSENT_COOKIE,
  ANALYTICS_CONSENT_VALUE,
  notifyAnalyticsConsent,
} from "@/firebase/analyticsConsent";
import { hasClientConfig } from "@/firebase/firebaseClient";

function AuthReadyShell({ children }: { children: React.ReactNode }) {
  useAuthToken(process.env.NEXT_PUBLIC_COOKIE_NAME || "authToken");
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const { isWeb } = usePlatform();
  useInitializeStores();

  const body = hasClientConfig ? (
    <AuthReadyShell>
      <Suspense fallback={<AuthChecking />}>
        <AuthGate>{children}</AuthGate>
      </Suspense>
    </AuthReadyShell>
  ) : (
    children
  );

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system">
        <Toaster
          toastOptions={{
            ariaProps: {
              role: "status",
              "aria-live": "polite",
            },
            error: {
              ariaProps: {
                role: "alert",
                "aria-live": "assertive",
              },
            },
          }}
        />
        {isHydrated && body}
        {isHydrated && (
          <Suspense fallback={null}>
            <AnalyticsRouteListener />
          </Suspense>
        )}
        {isHydrated && isWeb && (
          <aside aria-label="Cookie consent">
            <CookieConsent
              buttonText="Accept cookies"
              ariaAcceptLabel="Accept cookies"
              cookieName={ANALYTICS_CONSENT_COOKIE}
              cookieValue={ANALYTICS_CONSENT_VALUE}
              onAccept={() => {
                notifyAnalyticsConsent();
              }}
            >
              This app uses cookies to enhance the user experience.
            </CookieConsent>
          </aside>
        )}
      </NextThemesProvider>
    </NextUIProvider>
  );
}
