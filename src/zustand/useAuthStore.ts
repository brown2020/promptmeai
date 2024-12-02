import { User } from "firebase/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type FirebaseUser = Pick<User, "uid" | "displayName" | "email" | "photoURL">;

interface AuthState {
  user: FirebaseUser | null;
  setUser: (user: FirebaseUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => {
        if (user) {
          const firebaseUser: FirebaseUser = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          };

          set({ user: firebaseUser });
        } else {
          set({ user: null });
        }
      },

      logout: () => set({ user: null }),
    }),
    {
      name: "promptme-auth",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
