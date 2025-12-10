import { useAuthStore } from "./useAuthStore";
import { logger } from "@/utils/logger";

/**
 * Higher-order function that wraps async operations requiring authentication.
 * Automatically checks for authenticated user before executing the operation.
 *
 * @param fn - Async function that receives uid as first parameter
 * @returns Wrapped function that returns undefined if not authenticated
 */
export const withAuth = <TArgs extends unknown[], TResult>(
  fn: (uid: string, ...args: TArgs) => Promise<TResult>
): ((...args: TArgs) => Promise<TResult | undefined>) => {
  return async (...args: TArgs) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) {
      logger.warn("Operation requires authentication but no user is logged in");
      return undefined;
    }
    return fn(uid, ...args);
  };
};

/**
 * Get the current authenticated user's UID.
 * Returns undefined if not authenticated.
 */
export const getAuthUid = (): string | undefined => {
  const uid = useAuthStore.getState().uid;
  return uid || undefined;
};

/**
 * Check if a user is currently authenticated.
 */
export const isAuthenticated = (): boolean => {
  return !!useAuthStore.getState().uid;
};
