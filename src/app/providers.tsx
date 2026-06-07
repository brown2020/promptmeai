"use client";

import { NextUIProvider } from "@nextui-org/react";
import CookieConsent from "react-cookie-consent";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import useAuthToken from "@/hooks/useAuthToken";
import { useSyncExternalStore } from "react";
import { useInitializeStores } from "@/zustand/useInitializeStores";
import { usePlatform } from "@/zustand/usePlatformStore";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Keeps the Firebase auth state in sync and maintains the auth cookie that
  // src/proxy.ts reads to gate protected routes server-side. Route protection
  // itself lives in the proxy, not here.
  useAuthToken(process.env.NEXT_PUBLIC_COOKIE_NAME || "authToken");

  const { isWeb } = usePlatform();

  useInitializeStores();

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system">
        <Toaster />
        {isHydrated && children}
        {isHydrated && isWeb && (
          <CookieConsent>
            This app uses cookies to enhance the user experience.
          </CookieConsent>
        )}
      </NextThemesProvider>
    </NextUIProvider>
  );
}
