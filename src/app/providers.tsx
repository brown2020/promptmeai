"use client";

import { NextUIProvider } from "@nextui-org/react";
import CookieConsent from "react-cookie-consent";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import useAuthToken from "@/hooks/useAuthToken";
import { useEffect, useSyncExternalStore } from "react";
import { useInitializeStores } from "@/zustand/useInitializeStores";
import { usePlatform } from "@/zustand/usePlatformStore";
import { isPublicPath } from "@/utils/routes";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const { loading, uid } = useAuthToken(
    process.env.NEXT_PUBLIC_COOKIE_NAME || "authToken"
  );
  const router = useRouter();
  const pathname = usePathname();
  const { isWeb } = usePlatform();

  useInitializeStores();

  // Handle authentication redirect
  useEffect(() => {
    if (loading) return;

    if (!uid && !isPublicPath(pathname)) {
      // Use replace so the gated route doesn't pollute history (prevents a
      // back-button redirect bounce between the gated route and "/").
      router.replace("/");
    }
  }, [loading, pathname, router, uid]);

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
