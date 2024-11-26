"use client";

import { authenticateLoginPassword } from "@/lib/actions";
import { cn } from "@/utils/tailwind";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

const SignInForm = () => {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticateLoginPassword,
    undefined
  );

  useEffect(() => {
    if (errorMessage && !isPending) {
      toast.error(errorMessage, {
        id: "signin-error",
      });
    }
  }, [errorMessage, isPending]);

  return (
    <form className="flex flex-col gap-6" action={formAction}>
      <input
        name="email"
        type="email"
        autoComplete="email"
        required
        className="bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800"
        placeholder="Email address"
      />
      <input
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800"
        placeholder="Password"
      />
      <div className="text-sm text-right">
        <a
          href="jajvascript:void(0);"
          className="font-semibold hover:underline"
        >
          Forgot your password?
        </a>
      </div>
      <button
        type="submit"
        className={cn(
          "w-full shadow-xl py-3 px-6 text-sm font-semibold rounded-md text-white dark:text-[#EEE] bg-gray-800 hover:bg-[#222] focus:outline-none",
          {
            "opacity-50 cursor-not-allowed": isPending,
          }
        )}
        disabled={isPending}
      >
        {isPending ? "Please wait..." : "Log in"}
      </button>
    </form>
  );
};

export default SignInForm;
