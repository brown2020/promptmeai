import { create } from "zustand";
import { doc, runTransaction } from "firebase/firestore";
import { useAuthStore } from "./useAuthStore";
import { db } from "@/firebase/firebaseClient";
import { paths } from "@/firebase/paths";
import { logger } from "@/utils/logger";
import toast from "react-hot-toast";

interface CreditsState {
  reduceCredits: (amount: number) => Promise<boolean>;
  addCredits: (amount: number) => Promise<void>;
}

/**
 * Store for managing user credit operations.
 * Uses Firestore transactions to prevent race conditions.
 */
export const useCreditsStore = create<CreditsState>(() => ({
  reduceCredits: async (amount: number) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return false;

    const { default: useProfileStore } = await import("./useProfileStore");

    try {
      const userRef = doc(db, paths.userProfile(uid));

      const newCredits = await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(userRef);
        if (!snapshot.exists()) throw new Error("Profile not found");

        const currentCredits = snapshot.data().credits ?? 0;
        if (currentCredits < amount) {
          throw new Error("Insufficient credits");
        }

        const updated = currentCredits - amount;
        transaction.update(userRef, { credits: updated });
        return updated;
      });

      useProfileStore.setState((state) => ({
        profile: { ...state.profile, credits: newCredits },
      }));

      return true;
    } catch (error) {
      if (error instanceof Error && error.message === "Insufficient credits") {
        return false;
      }
      logger.error("Error reducing credits:", error);
      toast.error("Failed to update credits");
      return false;
    }
  },

  addCredits: async (amount: number) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    const { default: useProfileStore } = await import("./useProfileStore");

    try {
      const userRef = doc(db, paths.userProfile(uid));

      const newCredits = await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(userRef);
        if (!snapshot.exists()) throw new Error("Profile not found");

        const currentCredits = snapshot.data().credits ?? 0;
        const updated = currentCredits + amount;
        transaction.update(userRef, { credits: updated, totalCredits: updated });
        return updated;
      });

      useProfileStore.setState((state) => ({
        profile: { ...state.profile, credits: newCredits, totalCredits: newCredits },
      }));

      toast.success(`Added ${amount} credits to your account`);
    } catch (error) {
      logger.error("Error adding credits:", error);
      toast.error("Failed to add credits");
    }
  },
}));
