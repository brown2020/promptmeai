"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  showDeleteModal: boolean;
  onHideModal: () => void;
  onDeleteConfirm: () => void;
};

const fieldClass =
  "mb-4 w-full rounded-md border border-gray-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A8F70]";
const buttonClass =
  "rounded-md px-3 py-2 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A8F70]";

export default function DeleteConfirmModal({
  showDeleteModal,
  onHideModal,
  onDeleteConfirm,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!showDeleteModal || !dialog) return;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [showDeleteModal]);

  if (!showDeleteModal) {
    return null;
  }

  const handleDeleteConfirm = () => {
    if (deleteConfirmation === "DELETE ACCOUNT") {
      onDeleteConfirm();
      return;
    }
    toast.error("Please type “DELETE ACCOUNT” to confirm.");
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="delete-account-title"
      className="w-[min(100%,28rem)] rounded-md border-0 bg-white p-6 text-[#1E1F22] shadow-lg overscroll-contain backdrop:bg-black/50 dark:bg-[#272A2E] dark:text-[#EEE]"
      onCancel={(event) => {
        event.preventDefault();
        onHideModal();
      }}
    >
      <h2 id="delete-account-title" className="text-lg">
        Are you sure you want to delete your account?
      </h2>
      <p className="mt-2">
        This permanently deletes your sign-in, chats, credits and payment history. It can’t be undone.
      </p>
      <p className="mb-4 mt-2">
        Please type <strong>DELETE ACCOUNT</strong> to confirm.
      </p>
      <label htmlFor="delete-account-confirm" className="mb-2 block text-sm">
        Type DELETE ACCOUNT to confirm
      </label>
      <input
        id="delete-account-confirm"
        type="text"
        value={deleteConfirmation}
        onChange={(e) => setDeleteConfirmation(e.target.value)}
        className={fieldClass}
        autoFocus
      />
      <div className="flex justify-end gap-2">
        <button type="button" className={`${buttonClass} bg-gray-500`} onClick={onHideModal}>
          Cancel
        </button>
        <button type="button" className={`${buttonClass} bg-[#B91C1C]`} onClick={handleDeleteConfirm}>
          Delete account
        </button>
      </div>
    </dialog>
  );
}
