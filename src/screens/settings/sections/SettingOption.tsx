"use client";

import { useCallback, useState } from "react";
import useProfileStore from "@/zustand/useProfileStore";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import { clearSession as clearServerSession } from "@/firebase/sessionCookie";
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

  const clearSession = useCallback(async () => {
    await clearServerSession().catch(() => undefined);
    clearAuthDetails();
    router.replace("/");
  }, [router, clearAuthDetails]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch {
      console.warn("[auth] sign-out-failed");
    }
    await clearSession();
  }, [clearSession]);

  const onDeleteConfirm = useCallback(async () => {
    setShowDeleteModal(false);
    if (await deleteAccount()) {
      toast.success("Your account and all of its data were deleted.");
      await clearSession();
    }
  }, [deleteAccount, clearSession]);

  return (
    <div className="col-span-1 lg:col-span-2 xl:col-span-3 flex flex-col col-12 px-5 py-3 gap-3 border border-gray-500 rounded-md">
      <label htmlFor="setting-lable-key" className="text-sm font-medium">
        Settings:
      </label>
      <button
        type="button"
        className="btn-primary bg-[#e32012] self-start rounded-md hover:bg-[#e32012]/30"
        onClick={handleDeleteClick}
      >
        Delete Account
      </button>
      <button
        type="button"
        aria-label="Sign Out"
        className="btn-primary self-start rounded-md bg-[#0D6E56] hover:bg-[#0A5A46]"
        onClick={() => void handleLogout()}
      >
        Sign out
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
