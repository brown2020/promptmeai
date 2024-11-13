"use client";

import { auth } from "@/firebase/firebaseClient";
import HomeScreen from "@/screens/home";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
  const user = auth.currentUser;

  useEffect(() => {
    if (user?.uid) {
      return redirect("/chat");
    }
  }, [user?.uid]);

  return <HomeScreen />;
};

export default HomePage;
