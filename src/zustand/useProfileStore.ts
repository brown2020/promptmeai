import { create } from "zustand";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useAuthStore } from "./useAuthStore";
import { db } from "@/firebase/firebaseClient";
import { paths } from "@/firebase/paths";
import { logger } from "@/utils/logger";
import toast from "react-hot-toast";

export enum UsageMode {
  Credits = "CREDITS",
  ApiKeys = "API_KEYS",
}

export type APIKeys = {
  openAi: string;
  anthropic: string;
  googleGenerativeAi: string;
  mistral: string;
  fireworks: string;
};

export interface ProfileType {
  email: string;
  contactEmail: string;
  displayName: string;
  photoUrl: string;
  emailVerified: boolean;
  credits: number;
  totalCredits: number;
  usageMode: UsageMode;
  APIKeys: APIKeys;
}

const defaultProfile: ProfileType = {
  email: "",
  contactEmail: "",
  displayName: "",
  photoUrl: "",
  emailVerified: false,
  credits: 0,
  totalCredits: 1000,
  usageMode: UsageMode.Credits,
  APIKeys: {
    openAi: "",
    anthropic: "",
    googleGenerativeAi: "",
    mistral: "",
    fireworks: "",
  },
};

interface ProfileState {
  profile: ProfileType;
  isLoading: boolean;
  isDefaultData: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (newProfile: Partial<ProfileType>) => Promise<void>;
  // Kept for backward compatibility - delegates to useCreditsStore
  reduceCredits: (amount: number) => Promise<boolean>;
  addCredits: (amount: number) => Promise<void>;
  // Kept for backward compatibility - delegates to useAccountStore
  deleteAccount: () => Promise<void>;
}

/**
 * Store for user profile data.
 *
 * Note: Credit operations (reduceCredits, addCredits) are delegated to useCreditsStore.
 * Account operations (deleteAccount) are delegated to useAccountStore.
 * These are kept here for backward compatibility.
 */
const useProfileStore = create<ProfileState>((set, get) => ({
  profile: defaultProfile,
  isLoading: false,
  isDefaultData: true,

  fetchProfile: async () => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    try {
      set({ isLoading: true });
      const userRef = doc(db, paths.userProfile(uid));
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const profileData = docSnap.data() as ProfileType;

        const newProfile = {
          ...profileData,
          totalCredits:
            profileData?.totalCredits || defaultProfile.totalCredits,
          usageMode: profileData?.usageMode || defaultProfile.usageMode,
          APIKeys: profileData?.APIKeys || defaultProfile.APIKeys,
        };

        set({ profile: newProfile, isDefaultData: false });
      } else {
        const newProfile = {
          email: useAuthStore.getState().authEmail || "",
          contactEmail: useAuthStore.getState().authEmail || "",
          displayName: useAuthStore.getState().authDisplayName || "",
          photoUrl: useAuthStore.getState().authPhotoUrl || "",
          emailVerified: useAuthStore.getState().authEmailVerified || false,
          credits: 1000,
          totalCredits: 1000,
          usageMode: UsageMode.Credits,
          APIKeys: defaultProfile.APIKeys,
        };

        await setDoc(userRef, newProfile);
        set({ profile: newProfile, isDefaultData: false });
      }
    } catch (error) {
      logger.error("Error fetching or creating profile:", error);
      toast.error("Failed to load profile");
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (newProfile: Partial<ProfileType>) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    logger.log("Updating profile:", newProfile);

    const previousProfile = get().profile;

    // Optimistic update
    set((state) => ({
      profile: { ...state.profile, ...newProfile },
    }));

    try {
      const userRef = doc(db, paths.userProfile(uid));
      await updateDoc(userRef, { ...newProfile });
      logger.log("Profile updated successfully");
    } catch (error) {
      // Rollback on failure
      set({ profile: previousProfile });
      logger.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  },

  // Backward compatibility - delegates to useCreditsStore
  reduceCredits: async (amount: number) => {
    const { useCreditsStore } = await import("./useCreditsStore");
    return useCreditsStore.getState().reduceCredits(amount);
  },

  // Backward compatibility - delegates to useCreditsStore
  addCredits: async (amount: number) => {
    const { useCreditsStore } = await import("./useCreditsStore");
    return useCreditsStore.getState().addCredits(amount);
  },

  // Backward compatibility - delegates to useAccountStore
  deleteAccount: async () => {
    const { useAccountStore } = await import("./useAccountStore");
    await useAccountStore.getState().deleteAccount();
  },
}));

export default useProfileStore;
