import { create } from "zustand";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import { settleSessionCookie } from "@/firebase/sessionCookie";
import { deleteAccount as deleteAccountOnServer } from "@/actions/profileActions";
import { logger } from "@/utils/logger";
import toast from "react-hot-toast";

interface AccountState {
  isDeleting: boolean;
  deleteAccount: () => Promise<boolean>;
}

/**
 * Store for account management operations.
 * Waits for Firebase to restore the session and refreshes the session cookie,
 * then the server deletes all of the user's data and sign-in; the client signs out.
 */
export const useAccountStore = create<AccountState>((set) => ({
  isDeleting: false,

  deleteAccount: async () => {
    set({ isDeleting: true });

    try {
      await auth.authStateReady();
      if (!auth.currentUser) {
        toast.error("You must be logged in to delete your account");
        return false;
      }
      await settleSessionCookie();
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
