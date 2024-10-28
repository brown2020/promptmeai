"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { PropsWithChildren } from "react";
import { dark } from "@clerk/themes";

const ClerkAppProvider = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      dynamic
      appearance={{
        ...(theme === "dark" ? { baseTheme: dark } : {}),
      }}
    >
      {children}
    </ClerkProvider>
  );
};

export default ClerkAppProvider;
