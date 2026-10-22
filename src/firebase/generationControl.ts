import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/firebase/firebaseAdmin";
import { paths } from "@/firebase/paths";

/**
 * Calls onCancel when the user stops this request, even if the stop lands on
 * another server instance. Returns an idempotent unsubscribe.
 */
export function watchCancellation(
  uid: string,
  requestId: string,
  onCancel: () => void
): () => void {
  let active = true;
  const unsubscribe = adminDb
    .doc(paths.userGeneration(uid, requestId))
    .onSnapshot(
      (snapshot) => {
        if (active && snapshot.data()?.cancelled === true) onCancel();
      },
      () => undefined
    );
  return () => {
    if (!active) return;
    active = false;
    unsubscribe();
  };
}

export async function requestCancellation(
  uid: string,
  requestId: string
): Promise<void> {
  await adminDb
    .doc(paths.userGeneration(uid, requestId))
    .set({ cancelled: true, at: FieldValue.serverTimestamp() });
}
