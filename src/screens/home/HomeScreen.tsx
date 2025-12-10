"use client";

import AuthComponent from "@/components/AuthComponent";
import Spinner from "@/components/Spinner";
import ClientOnly from "@/components/ClientOnly";
import GreenWhiteLayout from "@/layouts/GreenWhiteLayout";
import { motion } from "framer-motion";
import { GiBrainTentacle } from "react-icons/gi";

const HomeScreen = () => {
  return (
    <ClientOnly
      fallback={
        <div className="h-screen w-screen flex flex-col items-center justify-center">
          <Spinner message="Getting things ready..." />
        </div>
      }
    >
      <GreenWhiteLayout>
        <div className="h-screen w-screen flex justify-center items-center p-6">
          <div className="flex flex-col gap-4 max-w-[450px] prose justify-center items-center text-center">
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
              className="text-[20px] sm:text-[24px] dark:text-[#EEE]"
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
              className="text-[16px] sm:text-[18px] dark:text-[#EEE]/[0.8]"
            >
              This demo showcases the capabilities of Prompt.me, a powerful tool
              that allows you to run the same prompts across leading AI models
              simultaneously, including OpenAI, Anthropic, Gemini, Llama, and
              Mistral. Sign in to start exploring the differences and strengths
              of each model, or learn more about how Prompt.me can help you make
              informed decisions in your AI projects.
            </motion.p>
            <AuthComponent />
          </div>
        </div>
      </GreenWhiteLayout>
    </ClientOnly>
  );
};

export default HomeScreen;
