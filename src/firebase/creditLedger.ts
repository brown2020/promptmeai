import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/firebase/firebaseAdmin";
import { paths } from "@/firebase/paths";
import { CATALOG_AMOUNT_CENTS } from "@/utils/paymentAmount";

export const SIGNUP_CREDITS = 1000;
export const CREDITS_PER_PURCHASE = 10_000;

const billingState = (uid: string) => `users/${uid}/billing/state`;

const readBalance = async (uid: string): Promise<number> => {
  const snapshot = await adminDb.doc(paths.userProfile(uid)).get();
  return snapshot.data()?.credits ?? 0;
};

export async function assertCreditsAvailable(uid: string): Promise<void> {
  const credits = await readBalance(uid);
  if (credits < 1) {
    throw new Error("Insufficient credits");
  }
}

export async function deductCredits(uid: string, amount: number): Promise<void> {
  if (!Number.isInteger(amount) || amount <= 0) return;

  await adminDb.runTransaction(async (transaction) => {
    const ref = adminDb.doc(paths.userProfile(uid));
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) return;

    const current = snapshot.data()?.credits ?? 0;
    transaction.update(ref, { credits: Math.max(0, current - amount) });
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
    const profile = await transaction.get(profileRef);
    const marker = await transaction.get(markerRef);

    if (profile.exists) {
      if (!marker.exists) {
        transaction.set(markerRef, { signupBonusGranted: true });
      }
      return;
    }

    const signupBonusGranted = marker.data()?.signupBonusGranted === true;
    const credits = signupBonusGranted ? 0 : SIGNUP_CREDITS;
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
        mistral: "",
      },
    });
    transaction.set(markerRef, { signupBonusGranted: true });
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
  const payments = adminDb.collection(paths.userPayments(uid));

  return adminDb.runTransaction(async (transaction) => {
    const existing = await transaction.get(
      payments.where("id", "==", paymentIntentId).limit(1)
    );
    const profile = await transaction.get(profileRef);
    if (!profile.exists) {
      throw new Error("Profile not found");
    }

    if (!existing.empty) {
      return {
        alreadyProcessed: true,
        credits: profile.data()?.credits ?? 0,
      };
    }

    const credits = (profile.data()?.credits ?? 0) + CREDITS_PER_PURCHASE;
    const totalCredits =
      (profile.data()?.totalCredits ?? 0) + CREDITS_PER_PURCHASE;
    transaction.update(profileRef, { credits, totalCredits });
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

export async function loadAuthIdentity(uid: string) {
  const user = await adminAuth.getUser(uid);
  return {
    email: user.email ?? "",
    displayName: user.displayName ?? "",
    photoUrl: user.photoURL ?? "",
    emailVerified: user.emailVerified,
  };
}
