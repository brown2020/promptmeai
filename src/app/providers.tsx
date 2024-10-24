import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ClerkAppProvider from "./clerk-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system">
        <ClerkAppProvider>{children}</ClerkAppProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
