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
import { HiOutlinePencilAlt } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { auth, db } from "@/firebase/firebaseClient";

type ManageProfileProps = {
  user?: User;
  isOpen: boolean;
  onClose?: () => void;
} & Omit<ModalProps, "children">;

const ManageProfile = ({ user, isOpen, onClose }: ManageProfileProps) => {
  const [name, setName] = useState<string>(user?.name || "");
  const [isSaving, setIsSaving] = useState(false);
  const { update: updateSession } = useSession(); // Get session data

  const handleSaveChanges = async () => {
    if (!auth.currentUser) return;

    // Validation
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setIsSaving(true);

    try {
      // Update Firebase Auth
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      // Update Firestore
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, { name });

      // Update NextAuth session
      await updateSession({
        name,
      });

      toast.success("Profile updated successfully!");
      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to update profile: ", error);
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isDismissable
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
              <div className="rounded-full absolute top-[36px] left-1/2 transform -translate-x-1/2 outline outline-2 outline-[#FFF] dark:outline-[#19181B] drop-shadow">
                {user?.image ? (
                  <Image
                    src={user?.image || ""}
                    alt="User Image"
                    width={72}
                    height={72}
                    className="rounded-full"
                  />
                ) : (
                  <FaUserCircle size={72} />
                )}
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Input
                  type="text"
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  endContent={<HiOutlinePencilAlt color="#52525B" />}
                  isRequired
                />
                <Input
                  type="email"
                  label="Email"
                  value={user?.email || ""}
                  isDisabled
                />
              </div>

              <div className="flex justify-end items-center pt-4">
                {/* <button className="flex gap-1 items-center bg-white dark:bg-[#19181B] text-red-500 dark:text-red-400 py-2 px-4 rounded hover:bg-red-50 dark:hover:bg-gray-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900">
                  <CgTrash size={17} /> Delete
                </button> */}
                <div className="flex gap-2 items-center">
                  <Button variant="text" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
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
