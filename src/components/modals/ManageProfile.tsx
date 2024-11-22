"use client";

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalProps,
  ModalHeader,
  Input,
} from "@nextui-org/react";
import { User } from "next-auth";
import Image from "next/image";
import { Button } from "../buttons";
import { CgTrash } from "react-icons/cg";

type ManageProfileProps = {
  user?: User;
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
} & Omit<ModalProps, "children">;

const ManageProfile = ({ user, isOpen, onClose }: ManageProfileProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={true}
      hideCloseButton
      radius="lg"
      classNames={{
        base: "bg-[#F1F1F1] relative",
        body: "py-6",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="border-b flex justify-between items-center h-[72px]" />
            <ModalBody className="bg-[#FFF]">
              <Image
                src={user?.image || ""}
                alt="User Image"
                width={72}
                height={72}
                className="rounded-full absolute top-[36px] m-auto left-0 right-0 outline outline-2 outline-[#FFF] drop-shadow"
              />
              <div className="mt-6 flex flex-col gap-2">
                <Input type="string" label="Name" value={user?.name || ""} />
                <Input type="email" label="Email" value={user?.email || ""} />
              </div>
              <div className="flex justify-between items-center pt-4">
                <button className="flex gap-1 items-center bg-white dark:bg-gray-800 text-red-500 dark:text-red-400 py-2 px-4 rounded hover:bg-red-50 dark:hover:bg-gray-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900">
                  <CgTrash size={18} /> Delete
                </button>
                <div className="flex gap-2 items-center">
                  <Button variant="text">Cancel</Button>
                  <Button disabled>Save Changes</Button>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ManageProfile;
