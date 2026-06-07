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
  const [warningContinue, setWarningContinue] = useState<boolean>(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Tear down any pending store subscription on unmount.
  useEffect(() => () => unsubscribeRef.current?.(), []);

  const proceed = () => {
    setWarningContinue(false);
    setShowWarning(false);
    onFinish();
  };

  const handleConfirm = () => {
    const { isLoading, abortController } = useChatStore.getState();

    // No request in flight: proceed immediately.
    if (!isLoading) {
      proceed();
      return;
    }

    // Abort the in-flight request, then proceed only once it has fully settled
    // (so the aborted stream can't write into the next conversation). React
    // state is updated from the store subscription callback, never during
    // render or inside an effect body.
    setWarningContinue(true);
    abortController?.abort();

    unsubscribeRef.current = useChatStore.subscribe((state) => {
      if (!state.isLoading) {
        unsubscribeRef.current?.();
        unsubscribeRef.current = null;
        proceed();
      }
    });
  };

  return (
    <ModalWarning
      isOpen={showWarning}
      backdrop="opaque"
      title="Another request is in progress. Continuing will stop the current request. Do you want to proceed?"
      confirmText={
        warningContinue ? (
          <Spinner color="default" size="sm" />
        ) : (
          "Yes, continue"
        )
      }
      disableConfirm={warningContinue}
      onConfirm={handleConfirm}
      onClose={() => {
        setShowWarning(false);
      }}
      isDismissable={true}
    />
  );
};

export default WarningChangingMessage;
