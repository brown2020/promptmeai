"use client";

import { NextUIProvider } from "@nextui-org/react";
import CookieConsent from "react-cookie-consent";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import useAuthToken from "@/hooks/useAuthToken";
import { useEffect, useState } from "react";
import { useInitializeStores } from "@/zustand/useInitializeStores";
import { usePlatform } from "@/zustand/usePlatformStore";

// Paths that don't require authentication
const PUBLIC_PATHS = ["/", "/about", "/terms", "/privacy", "/support"];

export function Providers({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { loading, uid } = useAuthToken(
    process.env.NEXT_PUBLIC_COOKIE_NAME || ""
  );
  const router = useRouter();
  const pathname = usePathname();
  const { isWeb } = usePlatform();

  useInitializeStores();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Handle authentication redirect
  useEffect(() => {
    if (loading) return;

    const isPublicPath = PUBLIC_PATHS.some((path) => pathname.includes(path));
    if (!uid && !isPublicPath) {
      router.push("/");
    }
  }, [loading, pathname, router, uid]);

  // Prevent rendering until hydrated
  if (!isHydrated) return null;

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system">
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
