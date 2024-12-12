"use client";

import { auth } from "@/firebase/firebaseClient";
import { cn } from "@/utils/tailwind";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";

const ResetPasswordForm = () => {
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [isWaitingConfirmation, setIsWaitingConfirmation] =
    useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please input the email address.");

      return;
    }

    setIsProcess(true);

    const actionCodeSettings = {
      url: `${window.location.origin}/auth/sign-in`,
      handleCodeInApp: true,
    };

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setIsProcess(false);
      setIsWaitingConfirmation(true);

      toast.success("Email reset password successfully sent to your email.");
    } catch (error) {
      console.error("Error sending sign-in link:", error);
      toast.error("An error occurred while sending the sign-in link.");
      setIsProcess(false);
    }
  };

  return (
    <Fragment>
      {isWaitingConfirmation ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-3 border rounded-md p-4 items-center text-center">
            <div>
              {`Check your email at ${email} for a message from Prompt.me`}
            </div>
            <div>{`If you don't see the message, check your spam folder. Mark it "not spam" or move it to your inbox.`}</div>
            <div>
              Click the reset password link in the message to complete the reset
              password process.
            </div>
            <div>
              Once you complete the reset password process, please try to login
              again.
            </div>
            <Link
              className="w-full shadow-xl py-3 px-6 text-sm font-semibold rounded-md text-white dark:text-[#EEE] bg-gray-800 hover:bg-[#222] focus:outline-none"
              href={"/auth/sign-in"}
            >
              Go to login page
            </Link>
          </div>
        </div>
      ) : (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            autoComplete="email"
            onChange={handleChange}
            value={email}
            required
            className="bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800"
            placeholder="Email address"
          />
          <button
            type="submit"
            className={cn(
              "w-full shadow-xl py-3 px-6 text-sm font-semibold rounded-md text-white dark:text-[#EEE] bg-gray-800 hover:bg-[#222] focus:outline-none",
              {
                "opacity-50 cursor-not-allowed": isProcess,
              }
            )}
            disabled={isProcess}
          >
            {isProcess ? "Please wait..." : "Reset Password"}
          </button>
        </form>
      )}
    </Fragment>
  );
};

export default ResetPasswordForm;
