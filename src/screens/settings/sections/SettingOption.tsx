"use client";

import { useCallback, useState } from "react";
import useProfileStore from "@/zustand/useProfileStore";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

const SettingOption = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteAccount = useProfileStore((state) => state.deleteAccount);
  const clearAuthDetails = useAuthStore((s) => s.clearAuthDetails);
  const router = useRouter();

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleLogout = useCallback(async () => {
    await signOut(auth);
    clearAuthDetails();
    router.replace("/");
  }, [router, clearAuthDetails]);

  const onDeleteConfirm = useCallback(async () => {
    setShowDeleteModal(false);
    try {
      await deleteAccount();
      await signOut(auth);
      clearAuthDetails();
      toast.success("Account deleted successfully.");
      router.replace("/");
    } catch (error) {
      console.error("Error on deletion of account:", error);
    }
  }, [deleteAccount, clearAuthDetails, router]);

  return (
    <div className="col-span-1 lg:col-span-2 xl:col-span-3 flex flex-col col-12 px-5 py-3 gap-3 border border-gray-500 rounded-md">
      <label htmlFor="setting-lable-key" className="text-sm font-medium">
        Settings:
      </label>
      <button
        className="btn-primary bg-[#e32012] self-start rounded-md hover:bg-[#e32012]/30"
        onClick={handleDeleteClick}
      >
        Delete Account
      </button>
      <button
        className="btn-primary self-start rounded-md bg-[#1A8F70] hover:bg-[#166854]"
        onClick={handleLogout}
      >
        Logout
      </button>
      <DeleteConfirmModal
        showDeleteModal={showDeleteModal}
        onHideModal={() => setShowDeleteModal(false)}
        onDeleteConfirm={onDeleteConfirm}
      />
    </div>
  );
};

export default SettingOption;
