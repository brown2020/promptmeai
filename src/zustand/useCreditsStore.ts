import { create } from "zustand";
import { doc, updateDoc } from "firebase/firestore";
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
 * Separated from profile store for single responsibility.
 */
export const useCreditsStore = create<CreditsState>(() => ({
  reduceCredits: async (amount: number) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return false;

    // Import dynamically to avoid circular dependency
    const { default: useProfileStore } = await import("./useProfileStore");
    const profile = useProfileStore.getState().profile;

    if (profile.credits < amount) {
      return false;
    }

    try {
      const newCredits = profile.credits - amount;
      const userRef = doc(db, paths.userProfile(uid));

      await updateDoc(userRef, { credits: newCredits });

      useProfileStore.setState((state) => ({
        profile: { ...state.profile, credits: newCredits },
      }));

      return true;
    } catch (error) {
      logger.error("Error reducing credits:", error);
      toast.error("Failed to update credits");
      return false;
    }
  },

  addCredits: async (amount: number) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    // Import dynamically to avoid circular dependency
    const { default: useProfileStore } = await import("./useProfileStore");
    const profile = useProfileStore.getState().profile;
    const newCredits = profile.credits + amount;

    try {
      const userRef = doc(db, paths.userProfile(uid));

      const newData = {
        credits: newCredits,
        totalCredits: newCredits,
      };

      await updateDoc(userRef, { ...newData });

      useProfileStore.setState((state) => ({
        profile: { ...state.profile, ...newData },
      }));

      toast.success(`Added ${amount} credits to your account`);
    } catch (error) {
      logger.error("Error adding credits:", error);
      toast.error("Failed to add credits");
    }
  },
}));
