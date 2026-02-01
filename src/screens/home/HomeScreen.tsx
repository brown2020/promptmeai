"use client";

import AuthComponent from "@/components/AuthComponent";
import Spinner from "@/components/Spinner";
import ClientOnly from "@/components/ClientOnly";
import GreenWhiteLayout from "@/layouts/GreenWhiteLayout";
import { motion } from "framer-motion";
import { GiBrainTentacle } from "react-icons/gi";
import { FaRocket, FaChartLine, FaShieldAlt } from "react-icons/fa";
import { IconType } from "react-icons";

interface Feature {
  icon: IconType;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: FaRocket,
    title: "Compare AI Models",
    description:
      "Run prompts across GPT, Claude, Gemini, Llama, and Mistral simultaneously.",
  },
  {
    icon: FaChartLine,
    title: "Track Usage",
    description: "Monitor token usage and costs with detailed analytics.",
  },
  {
    icon: FaShieldAlt,
    title: "Secure & Private",
    description: "Your conversations are encrypted and never shared.",
  },
];

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="p-6 bg-white dark:bg-gray-800 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow"
  >
    <feature.icon className="text-3xl text-[#1A8F70] mx-auto mb-4" />
    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
      {feature.title}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      {feature.description}
    </p>
  </motion.div>
);

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
        <div className="min-h-screen w-full">
          {/* Hero Section */}
          <section className="min-h-screen flex justify-center items-center p-6">
            <div className="flex flex-col gap-4 max-w-lg prose justify-center items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: [1, 1.2, 1],
                  transition: { duration: 0.6 },
                }}
              >
                <GiBrainTentacle size={64} className="text-[#1A8F70]" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: 0.2 },
                }}
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
              >
                Welcome to Prompt.me
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: 0.4 },
                }}
                className="text-base sm:text-lg text-gray-600 dark:text-gray-300"
              >
                Compare AI models side-by-side. Run the same prompts across
                leading AI models simultaneously and discover which one best
                fits your needs.
              </motion.p>
              <AuthComponent />
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-bold text-center mb-10 text-gray-900 dark:text-white"
              >
                Why Prompt.me?
              </motion.h2>
              <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <FeatureCard key={feature.title} feature={feature} index={index} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </GreenWhiteLayout>
    </ClientOnly>
  );
};

export default HomeScreen;
