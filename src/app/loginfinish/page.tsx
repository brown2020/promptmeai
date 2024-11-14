"use client";

import { useAuthStore } from "@/zustand/useAuthStore";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FirebaseError } from "firebase/app";
import useProfileStore from "@/zustand/useProfileStore";

export default function LoginFinishPage() {
    const router = useRouter();
    const setAuthDetails = useAuthStore((s) => s.setAuthDetails);
    const updateProfile = useProfileStore((s) => s.updateProfile);

    useEffect(() => {
        async function attemptSignIn() {
            try {
                if (!isSignInWithEmailLink(auth, window.location.href)) {
                    throw new Error("Sign in link is not valid");
                }

                let email = window.localStorage.getItem("grademeEmail");
                const name = window.localStorage.getItem("grademeName") || "";

                console.log("User signed in successfully:", email, name);
                if (!email) {
                    email = window.prompt("Please confirm your email");
                    if (!email) {
                        throw new Error("Email confirmation cancelled by user");
                    }
                }

                const userCredential = await signInWithEmailLink(
                    auth,
                    email,
                    window.location.href
                );

                const user = userCredential.user;
                const authEmail = user?.email;
                const uid = user?.uid;
                const selectedName = name || user?.displayName || "";

                console.log("User auth data:", authEmail, uid, selectedName);

                if (!uid || !authEmail) {
                    throw new Error("No user found");
                }

                console.log(
                    "User signed in successfully:",
                    authEmail,
                    uid,
                    selectedName
                );

                setAuthDetails({
                    uid,
                    authEmail,
                    authDisplayName: selectedName,
                });
                updateProfile({ displayName: selectedName });
            } catch (error) {
                let errorMessage = "Unknown error signing in";
                if (error instanceof FirebaseError) {
                    errorMessage = error.message;
                } else if (error instanceof Error) {
                    errorMessage = error.message;
                }

                console.log("ERROR", errorMessage);
                alert(errorMessage);
            } finally {
                window.localStorage.removeItem("grademeEmail");
                window.localStorage.removeItem("grademeName");
                router.replace("/tools");
            }
        }

        attemptSignIn();
    }, [router, setAuthDetails, updateProfile]);
}
