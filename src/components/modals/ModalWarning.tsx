"use client";

import { Modal, ModalContent, ModalBody, ModalProps } from "@nextui-org/react";
import { PiWarningFill } from "react-icons/pi";
import { Button } from "@/components/buttons";
import { ReactNode } from "react";

type ModalWarningProps = {
  isOpen: boolean;
  title: string;
  confirmText: ReactNode;
  disableConfirm?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
} & Omit<ModalProps, "children">;

const ModalWarning = ({
  isOpen,
  title,
  confirmText,
  disableConfirm,
  onClose,
  onConfirm,
  backdrop = "blur",
  isDismissable = false,
}: ModalWarningProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={isDismissable}
      hideCloseButton
      backdrop={backdrop}
    >
      <ModalContent>
        <ModalBody className="p-8 flex flex-col gap-4 items-center justify-center text-center">
          <PiWarningFill size={64} color="#FF6364" className="animate-pulse" />
          <span className="text-center">{title}</span>
          <Button onClick={onConfirm} disabled={disableConfirm}>
            {confirmText}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalWarning;
