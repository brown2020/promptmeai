"use client";

import { auth } from "@/firebase/firebaseClient";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CompleteSignIn = () => {
  const router = useRouter();
  const [message, setMessage] = useState<string>("Completing sign-in...");

  useEffect(() => {
    const completeSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem("emailForSignIn");
        if (!email) {
          email =
            window.prompt("Please provide your email for confirmation") || "";
        }

        try {
          const result = await signInWithEmailLink(
            auth,
            email,
            window.location.href
          );

          const accessToken = await result.user.getIdToken();

          await signIn("credentials", {
            email: result.user?.email || "",
            accessToken: accessToken,
          });
          setMessage("Sign-in complete! Redirecting...");
          router.push("/chat");
        } catch (error) {
          console.error("Error completing sign-in: ", error);
          setMessage("Failed to complete sign-in.");
        }
      }
    };

    completeSignIn();
  }, [router]);

  return <p>{message}</p>;
};

export default CompleteSignIn;
