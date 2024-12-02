import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import FirebaseAuthProvider from "./FirebaseAuthProvider";
import CookieProvider from "./CookieProvider";
import { Session } from "next-auth";
import { PropsWithChildren } from "react";
import AuthSessionProvider from "./AuthSessionProvider";

type ProvidersProps = {
  session: Session | null;
  sessionKey: number;
} & PropsWithChildren;

const Providers = ({ session, sessionKey, children }: ProvidersProps) => {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system">
        <AuthSessionProvider session={session} sessionKey={sessionKey}>
          <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
        </AuthSessionProvider>
        <CookieProvider />
      </NextThemesProvider>
    </NextUIProvider>
  );
};

export default Providers;
