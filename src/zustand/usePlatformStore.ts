import { create } from "zustand";

type PlatformState = {
  isRNWebView: boolean;
  isInitialized: boolean;
};

type PlatformActions = {
  initialize: () => void;
};

type PlatformStore = PlatformState & PlatformActions;

const detectRNWebView = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }
  return typeof window.ReactNativeWebView !== "undefined";
};

export const usePlatformStore = create<PlatformStore>((set, get) => ({
  isRNWebView: false,
  isInitialized: false,

  initialize: () => {
    if (get().isInitialized) return;

    set({
      isRNWebView: detectRNWebView(),
      isInitialized: true,
    });
  },
}));

export const usePlatform = () => {
  const isRNWebView = usePlatformStore((s) => s.isRNWebView);
  const isInitialized = usePlatformStore((s) => s.isInitialized);
  const initialize = usePlatformStore((s) => s.initialize);

  if (typeof window !== "undefined" && !isInitialized) {
    initialize();
  }

  return {
    isRNWebView,
    isInitialized,
    isWeb: !isRNWebView,
  };
};

export default usePlatformStore;
