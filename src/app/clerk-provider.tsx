"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { PropsWithChildren } from "react";
import { dark } from "@clerk/themes";
import { isIOSReactNativeWebView } from "@/utils/platform";

const ClerkAppProvider = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      dynamic
      appearance={{
        ...(theme === "dark" ? { baseTheme: dark } : {}),
        elements: {
          socialButtons: isIOSReactNativeWebView() ? "hidden" : "visible",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
};

export default ClerkAppProvider;
