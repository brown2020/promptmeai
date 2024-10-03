"use client";

import { Modal, ModalContent, ModalBody } from "@nextui-org/react";
import { PiWarningFill } from "react-icons/pi";
import { Button } from "@/components/buttons";

type ModalWarningProps = {
  isOpen: boolean;
  title: string;
  confirmText: string;
  onClose?: () => void;
};

const ModalWarning = ({
  isOpen,
  title,
  confirmText,
  onClose,
}: ModalWarningProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={false}
      hideCloseButton
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <ModalBody className="p-8 flex flex-col gap-4 items-center justify-center text-center">
            <PiWarningFill
              size={64}
              color="#FF6364"
              className="animate-pulse"
            />
            <span className="text-center">{title}</span>
            <Button onClick={onClose}>{confirmText}</Button>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalWarning;
