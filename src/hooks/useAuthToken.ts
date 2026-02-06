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

  const refreshAuthToken = useCallback(async () => {
    try {
      if (!auth.currentUser) return;
      const idTokenResult = await getIdToken(auth.currentUser, true);

      if (!isValidCookieName(cookieName)) {
        console.error(`Invalid cookie name: ${cookieName}`);
        return;
      }

      setCookie(cookieName, idTokenResult, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      if (!window.ReactNativeWebView) {
        window.localStorage.setItem(lastTokenRefresh, Date.now().toString());
      }
    } catch (err) {
      console.error("Error refreshing token:", err);
      if (isValidCookieName(cookieName)) {
        deleteCookie(cookieName);
      }
    }
  }, [cookieName, lastTokenRefresh]);

  const scheduleTokenRefresh = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (document.visibilityState === "visible") {
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
    if (user?.uid) {
      setAuthDetails({
        uid: user.uid,
        authEmail: user.email || "",
        authDisplayName: user.displayName || "",
        authPhotoUrl: user.photoURL || "",
        authEmailVerified: user.emailVerified || false,
        authReady: true,
        authPending: false,
      });

      // Set the auth cookie immediately so server actions can verify identity
      refreshAuthToken();
      scheduleTokenRefresh();
    } else {
      clearAuthDetails();
      if (isValidCookieName(cookieName)) {
        deleteCookie(cookieName);
      }
    }
  }, [user, setAuthDetails, clearAuthDetails, cookieName, refreshAuthToken, scheduleTokenRefresh]);

  return { uid: user?.uid, loading, error };
};

export default useAuthToken;
