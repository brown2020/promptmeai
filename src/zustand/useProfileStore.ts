import { create } from "zustand";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useAuthStore } from "./useAuthStore";
import { db } from "@/firebase/firebaseClient";
import { paths } from "@/firebase/paths";
import { logger } from "@/utils/logger";
import { deleteUser, getAuth } from "firebase/auth";

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
  fetchProfile: () => void;
  updateProfile: (newProfile: Partial<ProfileType>) => Promise<void>;
  reduceCredits: (amount: number) => Promise<boolean>;
  addCredits: (amount: number) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

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

      set({ isLoading: false });
    } catch (error) {
      logger.error("Error fetching or creating profile:", error);
      set({ isLoading: false });
    }
  },

  updateProfile: async (newProfile: Partial<ProfileType>) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    logger.log("Updating profile:", newProfile);

    try {
      const userRef = doc(db, paths.userProfile(uid));

      set((state) => ({
        profile: { ...state.profile, ...newProfile },
      }));

      await updateDoc(userRef, { ...newProfile });
      logger.log("Profile updated successfully");
    } catch (error) {
      logger.error("Error updating profile:", error);
    }
  },

  reduceCredits: async (amount: number) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return false;

    const profile = get().profile;
    if (profile.credits < amount) {
      return false;
    }

    try {
      const newCredits = profile.credits - amount;
      const userRef = doc(db, paths.userProfile(uid));

      await updateDoc(userRef, { credits: newCredits });

      set((state) => ({
        profile: { ...state.profile, credits: newCredits },
      }));

      return true;
    } catch (error) {
      logger.error("Error using credits:", error);
      return false;
    }
  },

  addCredits: async (amount: number) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    const profile = get().profile;
    const newCredits = profile.credits + amount;

    try {
      const userRef = doc(db, paths.userProfile(uid));

      const newData = {
        credits: newCredits,
        totalCredits: newCredits,
      };

      await updateDoc(userRef, { ...newData });

      set((state) => ({
        profile: { ...state.profile, ...newData },
      }));
    } catch (error) {
      logger.error("Error adding credits:", error);
    }
  },

  deleteAccount: async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const uid = useAuthStore.getState().uid;
    if (!uid || !currentUser) return;

    try {
      const userRef = doc(db, paths.userProfile(uid));
      // Delete the user profile data from Firestore
      await deleteDoc(userRef);

      // Delete the user from Firebase Authentication
      await deleteUser(currentUser);

      logger.log("Account deleted successfully");
    } catch (error) {
      logger.error("Error deleting account:", error);
    }
  },
}));

export default useProfileStore;
