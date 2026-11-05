import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, hasClientConfig, whenAuthReady } from "@/firebase/firebaseClient";

export type AuthSnapshot = {
  ready: boolean;
  user: User | null;
};

const pending: AuthSnapshot = { ready: false, user: null };
let current: AuthSnapshot = pending;
const listeners = new Set<() => void>();
let started = false;

function emit(next: AuthSnapshot) {
  if (current.ready === next.ready && current.user === next.user) return;
  current = next;
  listeners.forEach((listener) => listener());
}

/**
 * Firebase Auth is ready only after persistence is applied and the initial
 * user (or null) has been read. Subscribing earlier reports a false sign-out.
 */
export function subscribeAuth(listener: () => void) {
  if (!started && hasClientConfig && typeof window !== "undefined") {
    started = true;
    void whenAuthReady.then(() => {
      emit({ ready: true, user: auth.currentUser });
      onAuthStateChanged(
        auth,
        (user) => emit({ ready: true, user }),
        () => emit({ ready: true, user: auth.currentUser })
      );
    });
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAuthSnapshot(): AuthSnapshot {
  return current;
}

export function getServerAuthSnapshot(): AuthSnapshot {
  return pending;
}
