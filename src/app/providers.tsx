import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ClerkAppProvider from "./clerk-provider";
import FirebaseAuthProvider from "./firebase-auth-provider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system">
        <ClerkAppProvider>
          <SessionProvider>
            <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
          </SessionProvider>
        </ClerkAppProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
