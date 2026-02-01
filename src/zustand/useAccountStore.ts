import { create } from "zustand";
import { deleteDoc, doc } from "firebase/firestore";
import { useAuthStore } from "./useAuthStore";
import { db } from "@/firebase/firebaseClient";
import { paths } from "@/firebase/paths";
import { logger } from "@/utils/logger";
import { deleteUser, getAuth } from "firebase/auth";
import toast from "react-hot-toast";

interface AccountState {
  isDeleting: boolean;
  deleteAccount: () => Promise<boolean>;
}

/**
 * Store for account management operations.
 * Handles account deletion and related cleanup.
 */
export const useAccountStore = create<AccountState>((set) => ({
  isDeleting: false,

  deleteAccount: async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const uid = useAuthStore.getState().uid;

    if (!uid || !currentUser) {
      toast.error("You must be logged in to delete your account");
      return false;
    }

    set({ isDeleting: true });

    try {
      const userRef = doc(db, paths.userProfile(uid));

      // Delete the user profile data from Firestore
      await deleteDoc(userRef);

      // Delete the user from Firebase Authentication
      await deleteUser(currentUser);

      logger.log("Account deleted successfully");
      toast.success("Your account has been deleted");
      return true;
    } catch (error) {
      logger.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again.");
      return false;
    } finally {
      set({ isDeleting: false });
    }
  },
}));
