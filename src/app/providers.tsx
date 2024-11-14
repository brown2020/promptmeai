"use client";

import { NextUIProvider } from "@nextui-org/react";
import CookieConsent from "react-cookie-consent";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import useAuthToken from "@/hooks/useAuthToken";
import { useEffect } from "react";
import { useInitializeStores } from "@/zustand/useInitializeStores";

export function Providers({ children }: { children: React.ReactNode }) {
  const { loading, uid } = useAuthToken(process.env.NEXT_PUBLIC_COOKIE_NAME!);
  const router = useRouter();
  const pathname = usePathname();

  useInitializeStores();

  useEffect(() => {
    if (
      !loading &&
      !uid &&
      pathname != "/" &&
      !pathname.includes("/about") &&
      !pathname.includes("/terms") &&
      !pathname.includes("/privacy") &&
      !pathname.includes("/support")
    ) {
      router.push("/");
    }
  }, [loading, pathname, router, uid]);

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system">
        {children}
        <CookieConsent>
          This app uses cookies to enhance the user experience.
        </CookieConsent>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
