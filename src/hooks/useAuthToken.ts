import { useEffect, useCallback, useRef } from "react";
import { getIdToken } from "firebase/auth";
import { deleteCookie, setCookie } from "cookies-next";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAuthStore } from "@/zustand/useAuthStore";
import { auth } from "@/firebase/firebaseClient";

const isValidCookieName = (name: string) => /^[a-zA-Z0-9-_]+$/.test(name);

const REFRESH_INTERVAL = 50 * 60 * 1000; // 50 minutes
const DEBOUNCE_MS = 1000;

const useAuthToken = (cookieName = "authToken") => {
  const [user, loading, error] = useAuthState(auth);
  const setAuthDetails = useAuthStore((state) => state.setAuthDetails);
  const clearAuthDetails = useAuthStore((state) => state.clearAuthDetails);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastTokenRefresh = `lastTokenRefresh_${cookieName}`;

  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    try {
      if (!isValidCookieName(cookieName)) {
        console.warn(`Invalid cookie name: ${cookieName}`);
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
    } catch {
      console.warn("[auth] token-refresh-failed");
      if (isValidCookieName(cookieName)) {
        deleteCookie(cookieName, { path: "/" });
      }
      return false;
    }
  }, [cookieName, lastTokenRefresh]);

  const scheduleTokenRefresh = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (typeof document !== "undefined" && document.visibilityState === "visible") {
      timeoutRef.current = setTimeout(() => {
        void refreshAuthToken();
      }, REFRESH_INTERVAL);
    }
  }, [refreshAuthToken]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== lastTokenRefresh) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        scheduleTokenRefresh();
      }, DEBOUNCE_MS);
    };

    if (!window.ReactNativeWebView) {
      window.addEventListener("storage", handler);
    }

    return () => {
      window.removeEventListener("storage", handler);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [lastTokenRefresh, scheduleTokenRefresh]);

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

    void syncAuthState();

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
