import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";
import {
  browserLocalPersistence,
  connectAuthEmulator,
  getAuth,
  setPersistence,
  type Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID,
};

/** True when public Firebase web config is present (false in CI without secrets). */
export const hasClientConfig = Boolean(firebaseConfig.apiKey?.trim());

const LOOPBACK = /^(127\.0\.0\.1|localhost):\d{2,5}$/;

/**
 * Local emulator host for one service. Only honored on a loopback page so a
 * stored value can never redirect a deployed site's auth or data traffic.
 */
const emulatorHost = (envValue: string | undefined, storageKey: string) => {
  if (typeof window === "undefined") return undefined;
  if (!/^(127\.0\.0\.1|localhost)$/.test(window.location.hostname)) return undefined;
  const value = envValue || window.localStorage.getItem(storageKey) || "";
  return LOOPBACK.test(value) ? value : undefined;
};

let app: FirebaseApp | undefined;
let db: Firestore;
let auth: Auth;

if (hasClientConfig) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  if (typeof window !== "undefined") {
    const authEmulator = emulatorHost(
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST,
      "promptmeAuthEmulator"
    );
    const firestoreEmulator = emulatorHost(
      process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST,
      "promptmeFirestoreEmulator"
    );
    if (authEmulator && !auth.emulatorConfig) {
      connectAuthEmulator(auth, `http://${authEmulator}`, { disableWarnings: true });
    }
    if (firestoreEmulator) {
      const [host, port] = firestoreEmulator.split(":");
      try {
        connectFirestoreEmulator(db, host, Number(port));
      } catch {
        // Already connected after a hot reload.
      }
    }
    void setPersistence(auth, browserLocalPersistence);
    const appCheckSiteKey = process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY?.trim();
    if (appCheckSiteKey) {
      try {
        initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(appCheckSiteKey),
          isTokenAutoRefreshEnabled: true,
        });
      } catch {
        // Already started after a hot reload, or the host rejected the provider.
      }
    }
  }
} else {
  // CI gate jobs / SSG without Actions secrets: skip module-level init so
  // prerender does not throw auth/invalid-api-key.
  console.warn(
    "Firebase client config missing (NEXT_PUBLIC_FIREBASE_APIKEY); deferring init"
  );
  db = null as unknown as Firestore;
  auth = null as unknown as Auth;
}

export { db, auth };
