import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";
import useProfileStore from "./useProfileStore";
import { usePlatformStore } from "./usePlatformStore";

/**
 * Hook to initialize all stores when the app loads.
 * Should be called once in the root provider.
 */
export const useInitializeStores = () => {
  const uid = useAuthStore((state) => state.uid);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const initializePlatform = usePlatformStore((state) => state.initialize);

  // Initialize platform detection on mount
  useEffect(() => {
    initializePlatform();
  }, [initializePlatform]);

  // Fetch profile when user is authenticated
  useEffect(() => {
    if (!uid) return;
    fetchProfile();
  }, [fetchProfile, uid]);
};
