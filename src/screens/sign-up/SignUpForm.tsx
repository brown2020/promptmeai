"use client";

import { authenticateAccountRegister } from "@/lib/actions";
import { cn } from "@/utils/tailwind";
import { Checkbox } from "@nextui-org/react";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";

const SignUpForm = () => {
  const [authResult, formAction, isPending] = useActionState(
    authenticateAccountRegister,
    { success: false }
  );
  const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);

  useEffect(() => {
    if (!isPending) {
      if (!authResult.success && authResult.message) {
        toast.error(authResult.message, {
          id: "account-register-error",
        });
      }

      if (authResult.success) {
        toast.success("Account created successfully.", {
          id: "account-register-success",
        });
      }
    }
  }, [authResult.message, authResult.success, isPending]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    if (!isPrivacyAccepted) {
      e.preventDefault();
      toast.error("You must accept the Terms and Privacy Policy to proceed.", {
        id: "privacy-policy-error",
      });
    }
  };

  return (
    <form
      className="flex flex-col gap-6"
      action={formAction}
      onSubmit={handleSubmit}
    >
      <input
        name="name"
        type="text"
        autoComplete="name"
        required
        className="bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800"
        placeholder="Full name"
      />
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
      <div className="flex items-center">
        <Checkbox
          id="privacyPolicy"
          checked={isPrivacyAccepted}
          onChange={(e) => setIsPrivacyAccepted(e.target.checked)}
        >
          <span className="text-black">
            I accept the{" "}
            <a href="/terms" className="text-blue-500 underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-500 underline">
              Privacy Policy
            </a>
            .
          </span>
        </Checkbox>
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
        {isPending ? "Please wait..." : "Submit"}
      </button>
    </form>
  );
};

export default SignUpForm;
