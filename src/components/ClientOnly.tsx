"use client";

import { PropsWithChildren, useSyncExternalStore } from "react";

type ClientOnlyProps = {
  fallback?: React.ReactNode;
} & PropsWithChildren;

/**
 * Wrapper component that only renders children on the client side.
 * Prevents hydration mismatches for components that depend on browser APIs.
 */
const ClientOnly = ({ children, fallback = null }: ClientOnlyProps) => {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return fallback;
  }

  return children;
};

export default ClientOnly;
