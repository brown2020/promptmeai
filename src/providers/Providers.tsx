"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import FirebaseAuthProvider from "./FirebaseAuthProvider";
import CookieProvider from "./CookieProvider";
import { Session } from "next-auth";
import { PropsWithChildren, useEffect, useState } from "react";
import AuthSessionProvider from "./AuthSessionProvider";

type ProvidersProps = {
  session: Session | null;
  sessionKey: number;
} & PropsWithChildren;

const Providers = ({ session, sessionKey, children }: ProvidersProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <NextUIProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        <AuthSessionProvider session={session} sessionKey={sessionKey}>
          <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
        </AuthSessionProvider>
        <CookieProvider />
      </NextThemesProvider>
    </NextUIProvider>
  );
};

export default Providers;
