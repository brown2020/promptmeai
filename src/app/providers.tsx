"use client";

import { NextUIProvider } from "@nextui-org/react";
import CookieConsent from "react-cookie-consent";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import useAuthToken from "@/hooks/useAuthToken";
import { useEffect, useState } from "react";
import { useInitializeStores } from "@/zustand/useInitializeStores";

export function Providers({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { loading, uid } = useAuthToken(
    process.env.NEXT_PUBLIC_COOKIE_NAME || ""
  );
  const router = useRouter();
  const pathname = usePathname();

  const isClient = typeof window !== "undefined" && !window.ReactNativeWebView;

  useInitializeStores();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (
      !loading &&
      !uid &&
      pathname !== "/" &&
      !["/about", "/terms", "/privacy", "/support"].some((path) =>
        pathname.includes(path)
      )
    ) {
      router.push("/");
    }
  }, [loading, pathname, router, uid]);

  if (!isHydrated) return null; // Prevent rendering until hydrated

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system">
        {children}
        {isClient && (
          <CookieConsent>
            This app uses cookies to enhance the user experience.
          </CookieConsent>
        )}
      </NextThemesProvider>
    </NextUIProvider>
  );
}
