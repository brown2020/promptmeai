import { db } from "@/firebase/firebaseClient";
import { paths } from "@/firebase/paths";
import { logger } from "@/utils/logger";
import { Timestamp, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { create } from "zustand";

interface AuthState {
  uid: string;
  firebaseUid: string;
  authEmail: string;
  authDisplayName: string;
  authPhotoUrl: string;
  authEmailVerified: boolean;
  authReady: boolean;
  authPending: boolean;
  isAdmin: boolean;
  isAllowed: boolean;
  isInvited: boolean;
  lastSignIn: Timestamp | null;
  premium: boolean;
  credits: number;
}

interface AuthActions {
  setAuthDetails: (details: Partial<AuthState>) => void;
  clearAuthDetails: () => void;
}

type AuthStore = AuthState & AuthActions;

const defaultAuthState: AuthState = {
  uid: "",
  firebaseUid: "",
  authEmail: "",
  authDisplayName: "",
  authPhotoUrl: "",
  authEmailVerified: false,
  authReady: false,
  authPending: false,
  isAdmin: false,
  isAllowed: false,
  isInvited: false,
  lastSignIn: null,
  premium: false,
  credits: 0,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...defaultAuthState,

  setAuthDetails: async (details: Partial<AuthState>) => {
    const { ...oldState } = get();
    const newState = { ...oldState, ...details };
    set(newState);
    await updateUserDetailsInFirestore(newState, get().uid);
  },

  clearAuthDetails: () => set({ ...defaultAuthState }),
}));

// Fields that should be persisted to Firestore (not internal UI state)
const FIRESTORE_FIELDS: (keyof AuthState)[] = [
  "uid",
  "authEmail",
  "authDisplayName",
  "authPhotoUrl",
  "authEmailVerified",
];

async function updateUserDetailsInFirestore(
  details: Partial<AuthState>,
  uid: string
) {
  if (!uid) return;

  // Only write user-facing fields to Firestore, not internal state
  const firestoreData: Record<string, unknown> = {};
  for (const key of FIRESTORE_FIELDS) {
    if (key in details && details[key] !== undefined) {
      firestoreData[key] = details[key];
    }
  }

  // Skip write if no relevant fields changed
  if (Object.keys(firestoreData).length === 0) return;

  try {
    const userRef = doc(db, paths.user(uid));
    await setDoc(
      userRef,
      { ...firestoreData, lastSignIn: serverTimestamp() },
      { merge: true }
    );
  } catch (error) {
    logger.error("Error updating auth details in Firestore:", error);
  }
}
