import { useEffect, useCallback, useRef } from "react";
import { getIdToken } from "firebase/auth";
import { deleteCookie, setCookie } from "cookies-next";
import { debounce } from "lodash";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAuthStore } from "@/zustand/useAuthStore";
import { auth } from "@/firebase/firebaseClient";

const isValidCookieName = (name: string) => /^[a-zA-Z0-9-_]+$/.test(name);

const REFRESH_INTERVAL = 50 * 60 * 1000; // 50 minutes

const useAuthToken = (cookieName = "authToken") => {
  const [user, loading, error] = useAuthState(auth);
  const setAuthDetails = useAuthStore((state) => state.setAuthDetails);
  const clearAuthDetails = useAuthStore((state) => state.clearAuthDetails);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const lastTokenRefresh = `lastTokenRefresh_${cookieName}`;

  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    try {
      if (!isValidCookieName(cookieName)) {
        console.error(`Invalid cookie name: ${cookieName}`);
        return false;
      }

      if (!auth.currentUser) return false;

      const idTokenResult = await getIdToken(auth.currentUser, true);

      setCookie(cookieName, idTokenResult, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      if (!window.ReactNativeWebView) {
        window.localStorage.setItem(lastTokenRefresh, Date.now().toString());
      }

      return true;
    } catch (err) {
      console.error("Error refreshing token:", err);
      if (isValidCookieName(cookieName)) {
        deleteCookie(cookieName, { path: "/" });
      }
      return false;
    }
  }, [cookieName, lastTokenRefresh]);

  const scheduleTokenRefresh = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (typeof document !== "undefined" && document.visibilityState === "visible") {
      timeoutRef.current = setTimeout(refreshAuthToken, REFRESH_INTERVAL);
    }
  }, [refreshAuthToken]);

  // Storage change listener for cross-tab sync
  useEffect(() => {
    const debouncedHandler = debounce((e: StorageEvent) => {
      if (e.key === lastTokenRefresh) {
        scheduleTokenRefresh();
      }
    }, 1000);

    if (!window.ReactNativeWebView) {
      window.addEventListener("storage", debouncedHandler);
    }

    return () => {
      window.removeEventListener("storage", debouncedHandler);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      debouncedHandler.cancel();
    };
  }, [lastTokenRefresh, scheduleTokenRefresh]);

  // Sync auth state to store and set cookie on login
  useEffect(() => {
    if (loading) return;

    let isCancelled = false;

    async function syncAuthState() {
      if (!user?.uid) {
        clearAuthDetails();
        if (isValidCookieName(cookieName)) {
          deleteCookie(cookieName, { path: "/" });
        }
        return;
      }

      const hasAuthCookie = await refreshAuthToken();
      if (isCancelled) return;

      if (!hasAuthCookie) {
        clearAuthDetails();
        return;
      }

      setAuthDetails({
        uid: user.uid,
        authEmail: user.email || "",
        authDisplayName: user.displayName || "",
        authPhotoUrl: user.photoURL || "",
        authEmailVerified: user.emailVerified || false,
        authReady: true,
        authPending: false,
      });

      scheduleTokenRefresh();
    }

    syncAuthState();

    return () => {
      isCancelled = true;
    };
  }, [
    user,
    loading,
    setAuthDetails,
    clearAuthDetails,
    cookieName,
    refreshAuthToken,
    scheduleTokenRefresh,
  ]);

  return { uid: user?.uid, loading, error };
};

export default useAuthToken;
