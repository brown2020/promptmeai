import { useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import { getIdToken, type User } from "firebase/auth";
import { establishSession } from "@/actions/sessionActions";
import {
  getAuthSnapshot,
  getServerAuthSnapshot,
  subscribeAuth,
} from "@/firebase/authSnapshot";
import { clearSession } from "@/firebase/sessionCookie";
import { useAuthStore } from "@/zustand/useAuthStore";
import { auth } from "@/firebase/firebaseClient";

const REFRESH_INTERVAL = 50 * 60 * 1000; // 50 minutes
const DEBOUNCE_MS = 1000;

const useAuthToken = (cookieName = "authToken") => {
  const snapshot = useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getServerAuthSnapshot
  );
  const setAuthDetails = useAuthStore((state) => state.setAuthDetails);
  const clearAuthDetails = useAuthStore((state) => state.clearAuthDetails);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastTokenRefresh = `lastTokenRefresh_${cookieName}`;

  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    try {
      if (!auth.currentUser) return false;

      const idTokenResult = await getIdToken(auth.currentUser, true);
      await establishSession(idTokenResult);

      if (!window.ReactNativeWebView) {
        window.localStorage.setItem(lastTokenRefresh, Date.now().toString());
      }

      return true;
    } catch {
      console.warn("[auth] token-refresh-failed");
      await clearSession().catch(() => undefined);
      return false;
    }
  }, [lastTokenRefresh]);

  const scheduleTokenRefreshRef = useRef<() => void>(() => undefined);

  const scheduleTokenRefresh = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      void refreshAuthToken().finally(() => scheduleTokenRefreshRef.current());
    }, REFRESH_INTERVAL);
  }, [refreshAuthToken]);

  useEffect(() => {
    scheduleTokenRefreshRef.current = scheduleTokenRefresh;
  }, [scheduleTokenRefresh]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== lastTokenRefresh) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        scheduleTokenRefresh();
      }, DEBOUNCE_MS);
    };

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      void refreshAuthToken().finally(() => scheduleTokenRefresh());
    };

    if (!window.ReactNativeWebView) {
      window.addEventListener("storage", handler);
    }
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.removeEventListener("storage", handler);
      document.removeEventListener("visibilitychange", onVisible);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [lastTokenRefresh, refreshAuthToken, scheduleTokenRefresh]);

  useEffect(() => {
    // `currentUser` is null until persistence finishes. Clearing the cookie
    // in that window makes the next /chat load look signed out.
    if (!snapshot.ready) return;

    let isCancelled = false;

    function publish(current: User) {
      setAuthDetails({
        uid: current.uid,
        authEmail: current.email || "",
        authDisplayName: current.displayName || "",
        authPhotoUrl: current.photoURL || "",
        authEmailVerified: current.emailVerified || false,
        authReady: true,
        authPending: false,
      });
      scheduleTokenRefresh();
    }

    async function syncAuthState() {
      const current = auth.currentUser;
      if (!current?.uid) {
        clearAuthDetails();
        await clearSession().catch(() => undefined);
        const restored = auth.currentUser;
        if (isCancelled || !restored?.uid) return;
        if (!(await refreshAuthToken())) return;
        if (isCancelled) return;
        publish(restored);
        return;
      }

      const hasAuthCookie = await refreshAuthToken();
      if (isCancelled) return;

      if (!hasAuthCookie) {
        clearAuthDetails();
        return;
      }

      publish(current);
    }

    void syncAuthState();

    return () => {
      isCancelled = true;
    };
  }, [
    snapshot.ready,
    snapshot.user,
    setAuthDetails,
    clearAuthDetails,
    cookieName,
    refreshAuthToken,
    scheduleTokenRefresh,
  ]);

  return {
    uid: snapshot.user?.uid,
    loading: !snapshot.ready,
    error: undefined,
  };
};

export default useAuthToken;
