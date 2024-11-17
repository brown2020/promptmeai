import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import FirebaseAuthProvider from "./FirebaseAuthProvider";
import { SessionProvider } from "next-auth/react";
import CookieProvider from "./CookieProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system">
        <SessionProvider>
          <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
        </SessionProvider>
        <CookieProvider />
      </NextThemesProvider>
    </NextUIProvider>
  );
};

export default Providers;
