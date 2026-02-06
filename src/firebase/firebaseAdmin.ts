import admin from "firebase-admin";
import { getApps } from "firebase-admin/app";

function getAdminCredentials() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      "FIREBASE_PRIVATE_KEY is not set. Firebase Admin SDK cannot initialize."
    );
  }

  return {
    type: process.env.FIREBASE_TYPE,
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: privateKey.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID,
    authUri: process.env.FIREBASE_AUTH_URI,
    tokenUri: process.env.FIREBASE_TOKEN_URI,
    authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    clientCertsUrl: process.env.FIREBASE_CLIENT_CERTS_URL,
  };
}

if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert(getAdminCredentials()),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  });
}
const adminBucket = admin.storage().bucket();
const adminDb = admin.firestore();
const adminAuth = admin.auth();

/**
 * Verify the caller is authenticated by reading the auth cookie
 * and verifying it with Firebase Admin. Returns the user's UID.
 * Use in Server Actions and Route Handlers.
 */
export async function verifyAuth(): Promise<string> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || "authToken";
  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
    throw new Error("Unauthorized: No auth token provided");
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.uid;
  } catch {
    throw new Error("Unauthorized: Invalid auth token");
  }
}

export { adminBucket, adminDb, adminAuth, admin };
