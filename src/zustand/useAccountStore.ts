import { create } from "zustand";
import { signOut } from "firebase/auth";
import { useAuthStore } from "./useAuthStore";
import { auth } from "@/firebase/firebaseClient";
import { deleteAccount as deleteAccountOnServer } from "@/actions/profileActions";
import { logger } from "@/utils/logger";
import toast from "react-hot-toast";

interface AccountState {
  isDeleting: boolean;
  deleteAccount: () => Promise<boolean>;
}

/**
 * Store for account management operations.
 * The server deletes chats, profile, and sign-in; the client then signs out.
 */
export const useAccountStore = create<AccountState>((set) => ({
  isDeleting: false,

  deleteAccount: async () => {
    if (!useAuthStore.getState().uid) {
      toast.error("You must be logged in to delete your account");
      return false;
    }

    set({ isDeleting: true });

    try {
      await deleteAccountOnServer();
      await signOut(auth).catch(() => undefined);
      return true;
    } catch (error) {
      logger.warn("[account] delete-failed", error);
      toast.error("Failed to delete account. Please try again.");
      return false;
    } finally {
      set({ isDeleting: false });
    }
  },
}));
