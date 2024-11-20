import { create } from "zustand";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useAuthStore } from "./useAuthStore";
import { db } from "@/firebase/firebaseClient";
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
  name: string;
  image: string;
  emailVerified: Date | null;
  credits: number;
  totalCredits: number;
  usageMode: UsageMode;
  APIKeys: APIKeys;
}

const defaultProfile: ProfileType = {
  email: "",
  name: "",
  image: "",
  emailVerified: null,
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
  fetchProfile: (userId: string) => void;
  updateProfile: (
    userId: string,
    newProfile: Partial<ProfileType>
  ) => Promise<void>;
  reduceCredits: (userId: string, amount: number) => Promise<boolean>;
  addCredits: (userId: string, amount: number) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const useProfileStore = create<ProfileState>((set, get) => ({
  profile: defaultProfile,
  isLoading: false,
  isDefaultData: true,

  fetchProfile: async (userId) => {
    if (!userId) return;

    try {
      set({ isLoading: true });
      const userRef = doc(db, `users/${userId}`);
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
        console.error("User profile is not found!");
      }
      set({ isLoading: false });
    } catch (error) {
      console.error("Error fetching or creating profile:", error);
      set({ isLoading: false });
    }
  },

  updateProfile: async (userId, newProfile) => {
    if (!userId) return;

    try {
      const userRef = doc(db, `users/${userId}`);
      set((state) => ({
        profile: { ...state.profile, ...newProfile },
      }));
      await updateDoc(userRef, { ...newProfile });
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  },

  reduceCredits: async (userId, amount) => {
    if (!userId) return false;
    const profile = get().profile;
    if (profile.credits < amount) {
      return false;
    }
    try {
      const newCredits = profile.credits - amount;
      const userRef = doc(db, `users/${userId}`);
      await updateDoc(userRef, { credits: newCredits });
      set((state) => ({
        profile: { ...state.profile, credits: newCredits },
      }));
      return true;
    } catch (error) {
      console.error("Error using credits:", error);
      return false;
    }
  },

  addCredits: async (userId, amount) => {
    if (!userId) return;

    const profile = get().profile;
    const newCredits = profile.credits + amount;

    try {
      const userRef = doc(db, `users/${userId}`);
      const newData = {
        credits: newCredits,
        totalCredits: newCredits,
      };
      await updateDoc(userRef, { ...newData });
      set((state) => ({
        profile: { ...state.profile, ...newData },
      }));
    } catch (error) {
      console.error("Error adding credits:", error);
    }
  },

  deleteAccount: async () => {
    // const auth = getAuth(); // Get Firebase auth instance
    // const currentUser = auth.currentUser;
    // const uid = useAuthStore.getState().uid;
    // if (!uid || !currentUser) return;
    // try {
    //   const userRef = doc(db, `users/${uid}/profile/userData`);
    //   // Delete the user profile data from Firestore
    //   await deleteDoc(userRef);
    //   //Delete the user from Firebase Authentication
    //   await deleteUser(currentUser);
    //   console.log("Account deleted successfully");
    // } catch (error) {
    //   console.error("Error deleting account:", error);
    // }
  },
}));

export default useProfileStore;
