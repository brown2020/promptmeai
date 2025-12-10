import { create } from "zustand";

type PlatformState = {
  isRNWebView: boolean;
  isInitialized: boolean;
};

type PlatformActions = {
  initialize: () => void;
};

type PlatformStore = PlatformState & PlatformActions;

/**
 * Detects if the app is running inside a React Native WebView.
 * Should only be called client-side.
 */
const detectRNWebView = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }
  return typeof window.ReactNativeWebView !== "undefined";
};

/**
 * Global store for platform detection.
 * Centralizes React Native WebView detection to avoid repeated checks.
 */
export const usePlatformStore = create<PlatformStore>((set, get) => ({
  isRNWebView: false,
  isInitialized: false,

  initialize: () => {
    // Only initialize once
    if (get().isInitialized) return;

    set({
      isRNWebView: detectRNWebView(),
      isInitialized: true,
    });
  },
}));

/**
 * Hook to access platform state with automatic initialization.
 * Use this in components that need to know if running in RN WebView.
 */
export const usePlatform = () => {
  const { isRNWebView, isInitialized, initialize } = usePlatformStore();

  // Initialize on first access (client-side only)
  if (typeof window !== "undefined" && !isInitialized) {
    initialize();
  }

  return {
    isRNWebView,
    isInitialized,
    // Convenience: true if NOT in RN WebView (for showing web-only features)
    isWeb: !isRNWebView,
  };
};

export default usePlatformStore;
