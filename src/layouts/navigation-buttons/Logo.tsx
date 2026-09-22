"use client";

import Link from "next/link";
import { GiBrainTentacle } from "react-icons/gi";
import { usePlatform } from "@/zustand/usePlatformStore";
import { useAuthStore } from "@/zustand/useAuthStore";

const Logo = () => {
  const uid = useAuthStore((s) => s.uid);
  const { isRNWebView } = usePlatform();
  const canNavigate = Boolean(uid) || !isRNWebView;

  if (!canNavigate) {
    return (
      <div
        className="w-[32px] h-[32px] bg-[#909090] flex justify-center items-center rounded-lg"
        aria-hidden
      >
        <GiBrainTentacle className="text-white" size={26} />
      </div>
    );
  }

  return (
    <Link
      href="/chat"
      aria-label="Go to chat"
      className="group w-[32px] h-[32px] hover:bg-white bg-[#909090] flex justify-center items-center rounded-lg transition-transform duration-150 scale-100"
    >
      <GiBrainTentacle
        className="transition-colors duration-150 group-hover:text-[#1A8F70] text-white"
        size={26}
        aria-hidden
      />
    </Link>
  );
};

export default Logo;
