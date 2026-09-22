"use client";

import { useEffect, useRef, useState } from "react";
import ModalWarning from "./ModalWarning";
import { Spinner } from "@nextui-org/react";
import { useChatStore } from "@/zustand/useChatStore";

type WarningChangingMessageProps = {
  showWarning: boolean;
  setShowWarning: (show: boolean) => void;
  onFinish: () => void;
};

const WarningChangingMessage = ({
  showWarning,
  setShowWarning,
  onFinish,
}: WarningChangingMessageProps) => {
  const [waitingForSettle, setWaitingForSettle] = useState(false);
  const onFinishRef = useRef(onFinish);
  const setShowWarningRef = useRef(setShowWarning);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    setShowWarningRef.current = setShowWarning;
  }, [setShowWarning]);

  useEffect(() => {
    if (!waitingForSettle) return;

    const unsubscribe = useChatStore.subscribe((state) => {
      if (!state.isLoading) {
        setWaitingForSettle(false);
        setShowWarningRef.current(false);
        onFinishRef.current();
      }
    });

    return unsubscribe;
  }, [waitingForSettle]);

  const proceed = () => {
    setWaitingForSettle(false);
    setShowWarning(false);
    onFinish();
  };

  const handleConfirm = () => {
    const { isLoading, abortController } = useChatStore.getState();

    if (!isLoading) {
      proceed();
      return;
    }

    setWaitingForSettle(true);
    abortController?.abort();
  };

  return (
    <ModalWarning
      isOpen={showWarning}
      backdrop="opaque"
      title="Another request is in progress. Continuing will stop the current request. Do you want to proceed?"
      confirmText={
        waitingForSettle ? (
          <Spinner color="default" size="sm" />
        ) : (
          "Yes, continue"
        )
      }
      disableConfirm={waitingForSettle}
      onConfirm={handleConfirm}
      onClose={() => {
        setShowWarning(false);
      }}
      isDismissable={true}
    />
  );
};

export default WarningChangingMessage;
