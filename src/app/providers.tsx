"use client";

import { NextUIProvider } from "@nextui-org/react";
import CookieConsent from "react-cookie-consent";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import useAuthToken from "@/hooks/useAuthToken";
import { useEffect, useSyncExternalStore } from "react";
import { useInitializeStores } from "@/zustand/useInitializeStores";
import { usePlatform } from "@/zustand/usePlatformStore";
import { Toaster } from "react-hot-toast";

// Paths that don't require authentication
const PUBLIC_PATHS = ["/", "/about", "/terms", "/privacy", "/support"];

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

    const isPublicPath = PUBLIC_PATHS.some((path) =>
      path === "/" ? pathname === "/" : pathname.startsWith(path)
    );
    if (!uid && !isPublicPath) {
      router.push("/");
    }
  }, [loading, pathname, router, uid]);

  // Prevent rendering until hydrated
  if (!isHydrated) return null;

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system">
        <Toaster />
        {children}
        {isWeb && (
          <CookieConsent>
            This app uses cookies to enhance the user experience.
          </CookieConsent>
        )}
      </NextThemesProvider>
    </NextUIProvider>
  );
}
