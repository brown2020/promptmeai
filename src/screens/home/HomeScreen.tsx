"use client";

import Spinner from "@/components/Spinner";
import { useIsClient } from "@/hooks";
import { SignedOut } from "@clerk/clerk-react";
import { SignInButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { GiBrainTentacle } from "react-icons/gi";

const HomeScreen = () => {
  const isClient = useIsClient();

  return (
    <div className="h-screen w-screen flex justify-center items-center p-6">
      <div className="flex flex-col gap-4 max-w-[450px] prose justify-center items-center text-center">
        {!isClient && <Spinner />}
        <motion.div
          initial={{ scale: 0 }}
          animate={{
            scale: [1, 1.2, 1],
            transition: { duration: 0.6 },
          }}
        >
          <GiBrainTentacle size={64} color="#1A8F70" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.2 },
          }}
          className="text-[20px] sm:text-[24px]"
        >
          Welcome to Prompt.me
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.4 },
          }}
          className="text-[16px] sm:text-[18px]"
        >
          This demo showcases the capabilities of Prompt.me, a powerful tool
          that allows you to run the same prompts across leading AI models
          simultaneously, including OpenAI, Anthropic, Gemini, Llama, and
          Mistral. Sign in to start exploring the differences and strengths of
          each model, or learn more about how Prompt.me can help you make
          informed decisions in your AI projects.
        </motion.p>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full h-[40px] sm:h-[50px] bg-[#1A8F70] text-white rounded-lg text-[16px] sm:text-[18px] font-semibold shadow-md hover:bg-[#166854] focus:outline-none focus:ring-2 focus:ring-[#1A8F70] focus:ring-opacity-50 transition-all duration-300 ease-in-out"
        >
          <SignedOut>
            <SignInButton forceRedirectUrl="/chat" mode="modal">
              Sign in
            </SignInButton>
          </SignedOut>
        </motion.button>
      </div>
    </div>
  );
};

export default HomeScreen;
