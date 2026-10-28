import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/firebase/firebaseAdmin";
import { collections, paths } from "@/firebase/paths";
import { CATALOG_AMOUNT_CENTS } from "@/utils/paymentAmount";

export const SIGNUP_CREDITS = 1000;
export const CREDITS_PER_PURCHASE = 10_000;

const billingState = (uid: string) => `users/${uid}/billing/state`;

/**
 * True when the caller can spend at least one credit. A user who prompts
 * before their profile exists gets it created first (signup bonus once).
 */
export async function hasCreditsAvailable(uid: string): Promise<boolean> {
  await ensureUserProfile(uid, await loadAuthIdentity(uid));
  const snapshot = await adminDb.doc(paths.userProfile(uid)).get();
  return (snapshot.data()?.credits ?? 0) >= 1;
}

/**
 * Hold `amount` credits before a provider call.
 * Fails closed when the balance cannot cover the whole hold.
 */
export async function reserveCredits(uid: string, amount: number): Promise<boolean> {
  if (!Number.isInteger(amount) || amount <= 0) return false;

  return adminDb.runTransaction(async (transaction) => {
    const ref = adminDb.doc(paths.userProfile(uid));
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) return false;

    const current = Math.trunc(snapshot.data()?.credits ?? 0);
    if (current < amount) return false;

    transaction.update(ref, { credits: current - amount });
    return true;
  });
}

/** Return an unused hold. Does not change lifetime credits granted. */
export async function refundCredits(uid: string, amount: number): Promise<void> {
  if (!Number.isInteger(amount) || amount <= 0) return;

  await adminDb.runTransaction(async (transaction) => {
    const ref = adminDb.doc(paths.userProfile(uid));
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) return;

    const current = Math.trunc(snapshot.data()?.credits ?? 0);
    transaction.update(ref, { credits: current + amount });
  });
}

export async function ensureUserProfile(
  uid: string,
  identity: {
    email: string;
    displayName: string;
    photoUrl: string;
    emailVerified: boolean;
  }
) {
  const profileRef = adminDb.doc(paths.userProfile(uid));
  const markerRef = adminDb.doc(billingState(uid));

  await adminDb.runTransaction(async (transaction) => {
    const [profile, marker] = await Promise.all([
      transaction.get(profileRef),
      transaction.get(markerRef),
    ]);

    if (profile.exists) {
      if (!marker.exists) {
        transaction.set(markerRef, { signupBonusGranted: true });
        return;
      }
      if (identity.emailVerified && marker.data()?.signupBonusGranted !== true) {
        const current = profile.data()?.credits ?? 0;
        const total = profile.data()?.totalCredits ?? 0;
        transaction.update(profileRef, {
          credits: current + SIGNUP_CREDITS,
          totalCredits: total + SIGNUP_CREDITS,
          emailVerified: true,
        });
        transaction.set(markerRef, { signupBonusGranted: true });
      }
      return;
    }

    const alreadyGranted = marker.data()?.signupBonusGranted === true;
    const grantBonus = identity.emailVerified && !alreadyGranted;
    const credits = grantBonus ? SIGNUP_CREDITS : 0;
    transaction.set(profileRef, {
      email: identity.email,
      contactEmail: identity.email,
      displayName: identity.displayName,
      photoUrl: identity.photoUrl,
      emailVerified: identity.emailVerified,
      credits,
      totalCredits: credits,
      usageMode: "CREDITS",
      APIKeys: {
        openAi: "",
        anthropic: "",
        googleGenerativeAi: "",
      },
    });
    transaction.set(markerRef, {
      signupBonusGranted: alreadyGranted || identity.emailVerified,
    });
  });
}

export async function grantCatalogCredits(
  uid: string,
  paymentIntentId: string,
  amount: number
): Promise<{ alreadyProcessed: boolean; credits: number }> {
  if (amount !== CATALOG_AMOUNT_CENTS) {
    throw new Error("Invalid payment amount");
  }

  const profileRef = adminDb.doc(paths.userProfile(uid));
  const grantRef = adminDb.doc(paths.userGrant(uid, paymentIntentId));
  const payments = adminDb.collection(paths.userPayments(uid));

  return adminDb.runTransaction(async (transaction) => {
    const [existing, profile] = await Promise.all([
      transaction.get(grantRef),
      transaction.get(profileRef),
    ]);
    if (!profile.exists) {
      throw new Error("Profile not found");
    }

    if (existing.exists) {
      return {
        alreadyProcessed: true,
        credits: profile.data()?.credits ?? 0,
      };
    }

    const credits = (profile.data()?.credits ?? 0) + CREDITS_PER_PURCHASE;
    const totalCredits =
      (profile.data()?.totalCredits ?? 0) + CREDITS_PER_PURCHASE;
    transaction.update(profileRef, { credits, totalCredits });
    transaction.set(grantRef, {
      paymentIntentId,
      amount,
      createdAt: FieldValue.serverTimestamp(),
    });
    transaction.set(payments.doc(), {
      id: paymentIntentId,
      amount,
      createdAt: FieldValue.serverTimestamp(),
      status: "succeeded",
      mode: "stripe",
      platform: "web",
      productId: "payment_gateway",
      currency: "$",
    });
    return { alreadyProcessed: false, credits };
  });
}

/**
 * Deletes everything stored for a user: chats, profile, payment copies, the
 * billing marker, generation records and the user document, then the sign-in.
 * Stripe keeps its own payment records.
 */
export async function deleteUserData(uid: string): Promise<void> {
  await adminDb.recursiveDelete(adminDb.doc(`${collections.PROMPTME_CHATS}/${uid}`));
  await adminDb.recursiveDelete(adminDb.doc(paths.user(uid)));
  await adminAuth.deleteUser(uid);
}

export async function loadAuthIdentity(uid: string) {
  const user = await adminAuth.getUser(uid);
  return {
    email: user.email ?? "",
    displayName: user.displayName ?? "",
    photoUrl: user.photoURL ?? "",
    emailVerified: user.emailVerified,
  };
}
