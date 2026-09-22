"use client";

import { NextUIProvider } from "@nextui-org/react";
import CookieConsent from "react-cookie-consent";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import useAuthToken from "@/hooks/useAuthToken";
import { useSyncExternalStore } from "react";
import { useInitializeStores } from "@/zustand/useInitializeStores";
import { usePlatform } from "@/zustand/usePlatformStore";
import { Toaster } from "react-hot-toast";
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
    <AuthReadyShell>{children}</AuthReadyShell>
  ) : (
    children
  );

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system">
        <Toaster />
        {isHydrated && body}
        {isHydrated && isWeb && (
          <aside aria-label="Cookie consent">
            <CookieConsent>
              This app uses cookies to enhance the user experience.
            </CookieConsent>
          </aside>
        )}
      </NextThemesProvider>
    </NextUIProvider>
  );
}
