import { useEffect, useState } from "react";
import { getIdToken } from "firebase/auth";
import { deleteCookie, setCookie } from "cookies-next";
import { debounce } from "lodash";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAuthStore } from "@/zustand/useAuthStore";
import { auth } from "@/firebase/firebaseClient";

const useAuthToken = (cookieName = "authToken") => {
  const [user, loading, error] = useAuthState(auth);
  const setAuthDetails = useAuthStore((state) => state.setAuthDetails);
  const clearAuthDetails = useAuthStore((state) => state.clearAuthDetails);
  const [activityTimeout, setActivityTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const refreshInterval = 50 * 60 * 1000; // 50 minutes
  const lastTokenRefresh = `lastTokenRefresh_${cookieName}`;

  // Validate cookie name to prevent invalid arguments
  const isValidCookieName = (name: string) => /^[a-zA-Z0-9-_]+$/.test(name);

  const refreshAuthToken = async () => {
    try {
      if (!auth.currentUser) throw new Error("No user found");
      const idTokenResult = await getIdToken(auth.currentUser, true);

      if (!isValidCookieName(cookieName)) {
        throw new Error(`Invalid cookie name: ${cookieName}`);
      }

      setCookie(cookieName, idTokenResult, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      if (!window.ReactNativeWebView) {
        window.localStorage.setItem(lastTokenRefresh, Date.now().toString());
      }
    } catch (err) {
      console.error(
        err instanceof Error ? err.message : "Error refreshing token"
      );
      deleteCookie(cookieName);
    }
  };

  const scheduleTokenRefresh = () => {
    if (activityTimeout) clearTimeout(activityTimeout);

    if (document.visibilityState === "visible") {
      const timeoutId = setTimeout(refreshAuthToken, refreshInterval);
      setActivityTimeout(timeoutId);
    }
  };

  const handleStorageChange = debounce((e: StorageEvent) => {
    if (e.key === lastTokenRefresh) {
      scheduleTokenRefresh();
    }
  }, 1000);

  useEffect(() => {
    if (!window.ReactNativeWebView) {
      window.addEventListener("storage", handleStorageChange);
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (activityTimeout) clearTimeout(activityTimeout);
      handleStorageChange.cancel();
    };
  }, [activityTimeout, handleStorageChange]);

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
    } else {
      clearAuthDetails();
      deleteCookie(cookieName);
    }
  }, [user, setAuthDetails, clearAuthDetails, cookieName]);

  return { uid: user?.uid, loading, error };
};

export default useAuthToken;
