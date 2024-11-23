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
import { HiOutlinePencilAlt } from "react-icons/hi";
import { useState } from "react";

type ManageProfileProps = {
  user?: User;
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
} & Omit<ModalProps, "children">;

const ManageProfile = ({ user, isOpen, onClose }: ManageProfileProps) => {
  const [name, setName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={true}
      hideCloseButton
      radius="lg"
      classNames={{
        base: "bg-[#F1F1F1] dark:bg-[#0F0E10] relative",
        body: "py-6",
      }}
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="border-b dark:border-[#19181B] flex justify-between items-center h-[72px]" />
            <ModalBody className="bg-[#FFF] dark:bg-[#19181B]">
              <Image
                src={user?.image || ""}
                alt="User Image"
                width={72}
                height={72}
                className="rounded-full absolute top-[36px] m-auto left-0 right-0 outline outline-2 outline-[#FFF] dark:outline-[#19181B] drop-shadow"
              />
              <div className="mt-6 flex flex-col gap-2">
                <Input
                  type="string"
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  endContent={<HiOutlinePencilAlt color="#52525B" />}
                />
                <Input
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  endContent={<HiOutlinePencilAlt color="#52525B" />}
                />
              </div>
              <div className="flex justify-between items-center pt-4">
                <button className="flex gap-1 items-center bg-white dark:bg-[#19181B] text-red-500 dark:text-red-400 py-2 px-4 rounded hover:bg-red-50 dark:hover:bg-gray-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900">
                  <CgTrash size={17} /> Delete
                </button>
                <div className="flex gap-2 items-center">
                  <Button variant="text" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button>Save Changes</Button>
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
