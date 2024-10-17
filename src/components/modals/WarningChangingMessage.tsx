import { useEffect, useState } from "react";
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
  const { isLoading: anotherActiveRequest, abortController } = useChatStore();

  const [warningContinue, setWarningContinue] = useState<boolean>(false);

  useEffect(() => {
    if (warningContinue) {
      if (!anotherActiveRequest) {
        setWarningContinue(false);
        setShowWarning(false);
        onFinish();
      }
    }
  }, [anotherActiveRequest, onFinish, setShowWarning, warningContinue]);

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
      onConfirm={() => {
        setWarningContinue(true);
        abortController?.abort();
      }}
      onClose={() => {
        setShowWarning(false);
      }}
      isDismissable={true}
    />
  );
};

export default WarningChangingMessage;
