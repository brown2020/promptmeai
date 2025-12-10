"use client";

import { useState, useCallback } from "react";
import { useChatStore } from "@/zustand/useChatStore";

/**
 * Hook to manage warning modals when there's an active AI request.
 * Provides consistent UX across components that need to interrupt ongoing requests.
 */
export const useActiveRequestWarning = () => {
  const [showWarning, setShowWarning] = useState(false);
  const { isLoading, abortController } = useChatStore();

  /**
   * Execute an action, showing a warning modal if there's an active request.
   * If no active request, executes the action immediately.
   */
  const executeWithWarning = useCallback(
    (action: () => void) => {
      if (isLoading) {
        setShowWarning(true);
      } else {
        action();
      }
    },
    [isLoading]
  );

  /**
   * Handle user confirmation to proceed despite active request.
   * Aborts the current request and executes the pending action.
   */
  const handleConfirm = useCallback(
    (action: () => void) => {
      abortController?.abort();
      action();
      setShowWarning(false);
    },
    [abortController]
  );

  /**
   * Close the warning modal without taking action.
   */
  const handleCancel = useCallback(() => {
    setShowWarning(false);
  }, []);

  return {
    showWarning,
    setShowWarning,
    executeWithWarning,
    handleConfirm,
    handleCancel,
    isLoading,
    abortController,
  };
};

export default useActiveRequestWarning;
