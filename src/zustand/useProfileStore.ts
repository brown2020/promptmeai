import { create } from "zustand";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useAuthStore } from "./useAuthStore";
import { db } from "@/firebase/firebaseClient";

export interface ProfileType {
  email: string;
  contactEmail: string;
  displayName: string;
  photoUrl: string;
  emailVerified: boolean;
  credits: number;
  totalCredits: number;
}

const defaultProfile: ProfileType = {
  email: "",
  contactEmail: "",
  displayName: "",
  photoUrl: "",
  emailVerified: false,
  credits: 0,
  totalCredits: 0,
};

interface ProfileState {
  profile: ProfileType;
  isLoading: boolean;
  fetchProfile: () => void;
  updateProfile: (newProfile: Partial<ProfileType>) => Promise<void>;
  useCredits: (amount: number) => Promise<boolean>;
  addCredits: (amount: number) => Promise<void>;
}

const useProfileStore = create<ProfileState>((set, get) => ({
  profile: defaultProfile,
  isLoading: false,

  fetchProfile: async () => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    try {
      set({ isLoading: true });
      const userRef = doc(db, `users/${uid}/profile/userData`);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const profileData = docSnap.data() as ProfileType;
        const newProfile = {
          ...profileData,
          totalCredits: !profileData?.totalCredits
            ? profileData.credits
            : profileData.totalCredits,
        };

        set({ profile: newProfile });
      } else {
        const newProfile = {
          email: useAuthStore.getState().authEmail || "",
          contactEmail: useAuthStore.getState().authEmail || "",
          displayName: useAuthStore.getState().authDisplayName || "",
          photoUrl: useAuthStore.getState().authPhotoUrl || "",
          emailVerified: useAuthStore.getState().authEmailVerified || false,
          credits: 1000,
          totalCredits: 1000,
        };

        await setDoc(userRef, newProfile);
        set({ profile: newProfile });
      }

      set({ isLoading: false });
    } catch (error) {
      console.error("Error fetching or creating profile:", error);
      set({ isLoading: false });
    }
  },

  updateProfile: async (newProfile: Partial<ProfileType>) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    console.log("Updating profile:", newProfile);

    try {
      const userRef = doc(db, `users/${uid}/profile/userData`);

      set((state) => ({
        profile: { ...state.profile, ...newProfile },
      }));

      await updateDoc(userRef, { ...newProfile });
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  },

  useCredits: async (amount: number) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return false;

    const profile = get().profile;
    if (profile.credits < amount) {
      return false;
    }

    try {
      const newCredits = profile.credits - amount;
      const userRef = doc(db, `users/${uid}/profile/userData`);

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

  addCredits: async (amount: number) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    const profile = get().profile;
    const newCredits = profile.credits + amount;

    try {
      const userRef = doc(db, `users/${uid}/profile/userData`);

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
}));

export default useProfileStore;
