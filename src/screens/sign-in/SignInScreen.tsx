"use client";

import OAuthList from "@/components/OAuthList";
import Link from "next/link";
import SignInForm from "./SigInForm";
import { useEffect, useState } from "react";

const SignInScreen = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div
      className="bg-white rounded-xl px-6 py-8 space-y-6 max-w-md lg:ml-auto w-full"
      suppressHydrationWarning
    >
      <h3 className="text-3xl font-extrabold mb-8 text-center">Sign in</h3>

      {isClient && (
        <>
          <OAuthList />

          <div className="my-6 text-sm text-gray-400 text-center">
            <p>or continue with</p>
          </div>

          <SignInForm />

          <div className="text-center">
            <p>
              Don&apos;t have an account?
              <Link
                href="/auth/sign-up"
                className="font-semibold underline ml-1 cursor-pointer"
              >
                Register here
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default SignInScreen;
