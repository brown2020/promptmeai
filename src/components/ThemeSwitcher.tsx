"use client";

import { LuSun } from "react-icons/lu";
import { MdNightlightRound } from "react-icons/md";
import { useTheme } from "next-themes";
import { LazyMotion, domAnimation, m } from "framer-motion";
import ClientOnly from "./ClientOnly";

const ThemeSwitcher = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <ClientOnly>
      <LazyMotion features={domAnimation}>
        <div className="h-[32px] w-[60px] sm:h-[60px] sm:w-[32px] bg-[#E2E2E2] dark:bg-[#3F424A] rounded-xl flex gap-[8px] sm:flex-col justify-center items-center relative">
          <m.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`absolute w-[20px] h-[20px] rounded-lg drop-shadow ${
              isDarkMode ? "bg-[#64666D]" : "bg-[#FFF]"
            }`}
            style={{
              top: isDarkMode ? "6.1px" : "unset",
              bottom: isDarkMode ? "unset" : "6.1px",
              left: "6.1px",
            }}
          />

          <button
            type="button"
            aria-label="Switch to dark theme"
            onClick={() => setTheme("dark")}
            className="w-[20px] h-[20px] flex justify-center items-center z-10"
          >
            <MdNightlightRound size={12} aria-hidden />
          </button>

          <button
            type="button"
            aria-label="Switch to light theme"
            onClick={() => setTheme("light")}
            className="w-[20px] h-[20px] flex justify-center items-center z-10"
          >
            <LuSun size={12} aria-hidden />
          </button>
        </div>
      </LazyMotion>
    </ClientOnly>
  );
};

export default ThemeSwitcher;
