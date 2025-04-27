"use client";

import { auth } from "@/firebase/firebaseClient";
import HomeScreen from "@/screens/home";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const HomePage = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.uid) {
      router.push("/chat");
    }
  }, [user?.uid, loading, router]);

  return <HomeScreen />;
};

export default HomePage;
