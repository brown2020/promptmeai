"use client";

import { LuSun } from "react-icons/lu";
import { MdNightlightRound } from "react-icons/md";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useIsClient } from "@/hooks";

const ThemeSwitcher = () => {
  const isClient = useIsClient();
  const { theme, setTheme } = useTheme();

  if (!isClient) return null; // Avoid rendering if not mounted (prevents hydration mismatch)

  // Handle switching theme and animate button movement
  const isDarkMode = theme === "dark";

  return (
    <div className="h-[32px] w-[60px] sm:h-[60px] sm:w-[32px] bg-[#E2E2E2] dark:bg-[#3F424A] rounded-xl flex gap-[8px] sm:flex-col justify-center items-center relative">
      {/* Animated button switching between dark and light mode */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`absolute w-[20px] h-[20px] rounded-lg drop-shadow ${
          isDarkMode ? "bg-[#64666D]" : "bg-[#FFF]"
        }`}
        style={{
          top: isDarkMode ? "6.1px" : "unset", // Vertical movement for light/dark
          bottom: isDarkMode ? "unset" : "6.1px",
          left: "6.1px",
        }}
      ></motion.div>

      {/* Dark mode button */}
      <button
        onClick={() => setTheme("dark")}
        className="w-[20px] h-[20px] flex justify-center items-center z-10"
      >
        <MdNightlightRound size={12} />
      </button>

      {/* Light mode button */}
      <button
        onClick={() => setTheme("light")}
        className="w-[20px] h-[20px] flex justify-center items-center z-10"
      >
        <LuSun size={12} />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
