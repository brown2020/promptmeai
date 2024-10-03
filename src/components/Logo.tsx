"use client";

import { GiBrainTentacle } from "react-icons/gi";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      className={`group cursor-pointer w-[32px] h-[32px] ${
        isPressed ? "bg-white" : "hover:bg-white bg-[#909090]"
      } flex justify-center items-center rounded-lg transition-transform duration-150 ${
        isPressed ? "scale-95" : "scale-100"
      }`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={() => router.push("/chat")}
    >
      <GiBrainTentacle
        className={`transition-colors duration-150 ${
          isPressed ? "text-[#1A8F70]" : "group-hover:text-[#1A8F70] text-white"
        }`}
        size={26}
      />
    </div>
  );
};

export default Logo;
