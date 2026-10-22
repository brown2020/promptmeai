"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  LuEye as Eye,
  LuEyeOff as EyeOff,
  LuLock as LockIcon,
  LuMail as MailIcon,
} from "react-icons/lu";
import toast from "react-hot-toast";
import Image from "next/image";
import googleLogo from "@/app/assets/google.svg";
import { auth, hasClientConfig } from "@/firebase/firebaseClient";
import { settleSessionCookie } from "@/firebase/sessionCookie";
import { mapAuthError } from "@/utils/authErrors";
import { useAuthStore } from "@/zustand/useAuthStore";
import { usePlatform } from "@/zustand/usePlatformStore";

export type AuthPageMode = "login" | "signup" | "forgot";

type Props = { mode: AuthPageMode };

const SESSION_TIMEOUT_MS = 12_000;

const TITLES: Record<AuthPageMode, string> = {
  login: "Sign in",
  signup: "Create account",
  forgot: "Forgot password",
};

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

function storeAuthInfo(em: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("promptmeEmail", em);
  window.localStorage.setItem("promptmeName", em.split("@")[0]);
}

function PasswordField({
  value,
  onChange,
  autoComplete,
  invalid,
  describedBy,
}: {
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  invalid?: boolean;
  describedBy?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <>
      <label htmlFor="auth-password" className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-200">
        Password
      </label>
      <div className="relative">
        <input
          id="auth-password"
          name="password"
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your password…"
          className="input-primary w-full pr-12"
          required
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          spellCheck={false}
        />
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-600 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A8F70] dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {show ? <EyeOff size={20} aria-hidden /> : <Eye size={20} aria-hidden />}
        </button>
      </div>
    </>
  );
}

function AuthFooterLinks({ mode }: { mode: AuthPageMode }) {
  if (mode === "login") {
    return (
      <p>
        No account?{" "}
        <Link href="/signup" className="text-[#0B6B52] underline hover:text-[#084D3B] dark:text-[#7DDFC4] dark:hover:text-white">
          Create account
        </Link>
      </p>
    );
  }
  if (mode === "signup") {
    return (
      <p>
        Already have an account?{" "}
        <Link href="/login" className="text-[#0B6B52] underline hover:text-[#084D3B] dark:text-[#7DDFC4] dark:hover:text-white">
          Sign in
        </Link>
      </p>
    );
  }
  return (
    <p>
      Remembered it?{" "}
      <Link href="/login" className="text-[#0B6B52] underline hover:text-[#084D3B] dark:text-[#7DDFC4] dark:hover:text-white">
        Back to sign in
      </Link>
    </p>
  );
}

type ErrorField = "email" | "password" | "terms" | null;

function errorFieldFor(error: string | null): ErrorField {
  if (!error) return null;
  const lower = error.toLowerCase();
  if (lower.includes("terms")) return "terms";
  if (lower.includes("password") && !lower.includes("email")) return "password";
  return "email";
}

function useFocusErrorField(error: string | null): ErrorField {
  const field = errorFieldFor(error);
  useEffect(() => {
    if (field) document.getElementById(`auth-${field}`)?.focus();
  }, [field, error]);
  return field;
}

function SubmitLabel({ mode, loading }: { mode: AuthPageMode; loading: boolean }) {
  if (loading) return <span aria-live="polite">Working…</span>;
  const Icon = mode === "forgot" ? MailIcon : LockIcon;
  const label = mode === "forgot" ? "Send reset link" : TITLES[mode];
  return (
    <>
      <Icon size={18} aria-hidden />
      {label}
    </>
  );
}

export function AuthPageForm({ mode }: Props) {
  const router = useRouter();
  const setAuthDetails = useAuthStore((s) => s.setAuthDetails);
  const { isWeb } = usePlatform();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const errorField = useFocusErrorField(error);

  const finishSignedIn = async () => {
    await withTimeout(settleSessionCookie(), SESSION_TIMEOUT_MS, "Session sync");
    const u = auth.currentUser!;
    setAuthDetails({
      uid: u.uid,
      authEmail: u.email || "",
      authDisplayName: u.displayName || "",
      authPhotoUrl: u.photoURL || "",
      authEmailVerified: u.emailVerified || false,
      authReady: true,
      authPending: false,
    });
    storeAuthInfo(u.email || email);
    router.replace("/chat");
  };

  const runAuth = async (action: () => Promise<void>) => {
    setError(null);
    if (!hasClientConfig) {
      setError("Authentication is not configured.");
      return;
    }
    setLoading(true);
    try {
      await action();
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (mode !== "forgot" && !password) {
      setError("Please enter your password.");
      return;
    }
    if (mode === "signup" && !acceptTerms) {
      setError("Please accept the terms and privacy policy.");
      return;
    }
    if (mode === "forgot") {
      void (async () => {
        setError(null);
        if (!hasClientConfig) {
          setError("Authentication is not configured.");
          return;
        }
        setLoading(true);
        try {
          await sendPasswordResetEmail(auth, email.trim());
          setResetSent(true);
          toast.success(`Password reset email sent to ${email.trim()}`);
        } catch (err) {
          setError(mapAuthError(err));
        } finally {
          setLoading(false);
        }
      })();
      return;
    }

    void runAuth(async () => {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      await finishSignedIn();
    });
  };

  const onGoogle = () => {
    if (mode === "signup" && !acceptTerms) {
      setError("Please accept the terms and privacy policy.");
      return;
    }
    void runAuth(async () => {
      await signInWithPopup(auth, new GoogleAuthProvider());
      await finishSignedIn();
    });
  };

  if (resetSent) {
    return (
      <div className="mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h1 className="mb-4 text-center text-3xl font-semibold text-gray-900 dark:text-white">
          {TITLES[mode]}
        </h1>
        <div className="flex flex-col gap-3 text-sm text-gray-700 dark:text-gray-300" role="status">
          <p>
            If an account exists for <strong>{email}</strong>, a password reset
            link is on its way. Check your inbox and spam folder.
          </p>
          <Link href="/login" className="btn-primary text-center">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h1 className="mb-4 text-center text-3xl font-semibold text-gray-900 dark:text-white">
        {TITLES[mode]}
      </h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
        {mode !== "forgot" && isWeb && (
          <>
            <button
              type="button"
              onClick={onGoogle}
              disabled={loading}
              className="flex w-full items-center gap-2 rounded-md border px-4 py-2 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A8F70] disabled:opacity-60 dark:hover:bg-gray-800"
            >
              <span className="relative h-6 w-6">
                <Image src={googleLogo} alt="" fill sizes="24px" className="object-contain" />
              </span>
              <span className="grow text-center">Continue with Google</span>
            </button>
            <div className="flex h-8 items-center justify-center">
              <hr className="h-px grow border-0 bg-gray-300" />
              <span className="px-3 text-sm text-gray-500 dark:text-gray-300">or</span>
              <hr className="h-px grow border-0 bg-gray-300" />
            </div>
          </>
        )}

        <label htmlFor="auth-email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Email
        </label>
        <input
          id="auth-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email…"
          className="input-primary"
          required
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          aria-invalid={errorField === "email" || undefined}
          aria-describedby={error ? "auth-error" : undefined}
        />

        {mode !== "forgot" && (
          <PasswordField
            value={password}
            onChange={setPassword}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            invalid={errorField === "password"}
            describedBy={error ? "auth-error" : undefined}
          />
        )}

        {mode === "login" && (
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-[#0B6B52] underline hover:text-[#084D3B] dark:text-[#7DDFC4] dark:hover:text-white"
            >
              Forgot password?
            </Link>
          </div>
        )}

        {mode === "signup" && (
          <label className="flex min-h-11 items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
            <input
              id="auth-terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="size-5 shrink-0"
              required
              aria-invalid={errorField === "terms" || undefined}
            />
            <span>
              I accept the{" "}
              <Link href="/terms" className="underline">
                terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                privacy
              </Link>{" "}
              policy.
            </span>
          </label>
        )}

        {error && (
          <p id="auth-error" role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary disabled:opacity-60" disabled={loading}>
          <span className="flex h-8 items-center justify-center gap-2">
            <SubmitLabel mode={mode} loading={loading} />
          </span>
        </button>

        <div className="mt-2 space-y-1 text-center text-sm text-gray-700 dark:text-gray-300">
          <AuthFooterLinks mode={mode} />
        </div>
      </form>
    </div>
  );
}
