"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, useMemo } from "react";

type AuthSessionProviderProps = {
  session: Session | null;
  sessionKey: number;
} & PropsWithChildren;

const AuthSessionProvider = ({
  session,
  sessionKey,
  children,
}: AuthSessionProviderProps) => {
  const memoizedSessionKey = useMemo(() => {
    return sessionKey;
  }, [sessionKey]);

  return (
    <SessionProvider key={memoizedSessionKey} session={session}>
      {children}
    </SessionProvider>
  );
};

export default AuthSessionProvider;
