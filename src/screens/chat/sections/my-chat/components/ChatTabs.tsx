"use client";

import { PiChatsCircleFill } from "react-icons/pi";
import { motion } from "framer-motion";
import { cn } from "@/utils/tailwind";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { TbPinnedFilled } from "react-icons/tb";
import React from "react";

const ChatTabs = () => {
  const { chats, pinnedChats, activeTab, setActiveTab } = useChatSideBarStore(
    (state) => state
  );

  const buttonWidth = 135.5;
  const gapBetweenButtons = 10;

  return (
    <div className="bg-[#EEE] dark:bg-[#3F424A] rounded-xl border-[0.6px] border-[#E2E2E2] dark:border-[#3F424A] h-[48px] flex gap-[10px] shrink-0 p-[4px] relative">
      <motion.div
        className="absolute top-[4px] bottom-[4px] left-[4px] w-[135.5px] bg-white dark:bg-[#1E1F22] rounded-lg shadow-lg"
        initial={false}
        animate={{
          x: activeTab === "chats" ? 0 : buttonWidth + gapBetweenButtons,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      <button
        className={cn(
          "relative z-10 w-[135.5px] flex gap-[6px] h-full items-center justify-center",
          {
            "text-[#14B48D] dark:text-[#23C69E] font-semibold":
              activeTab === "chats",
            "text-[#3B3B3B] dark:text-[#EEE]": activeTab !== "chats",
          }
        )}
        onClick={() => setActiveTab("chats")}
      >
        <PiChatsCircleFill
          size={14}
          className={cn({
            "text-[#14B48D] dark:text-[#23C69E]": activeTab === "chats",
            "text-[#3B3B3B] dark:text-[#EEE]": activeTab !== "chats",
          })}
        />
        <span className="uppercase text-[12px]">Chats</span>
        <span
          className={cn("rounded-sm px-[4px] py-[2px] text-[10px] font-semibold", {
            "bg-[#14B48D]/[0.15] dark:bg-[#23C69E]/[0.15]":
              activeTab === "chats",
            "bg-[#3B3B3B]/[0.11] dark:bg-[#EEE]/[0.15]": activeTab !== "chats",
          })}
        >
          {chats.length}
        </span>
      </button>

      <button
        className={cn(
          "relative z-10 w-[135.5px] flex gap-[6px] h-full items-center justify-center",
          {
            "text-[#14B48D] dark:text-[#23C69E] font-semibold":
              activeTab === "pinned",
            "text-[#3B3B3B] dark:text-[#EEE]": activeTab !== "pinned",
          }
        )}
        onClick={() => setActiveTab("pinned")}
      >
        <TbPinnedFilled
          size={14}
          className={cn({
            "text-[#14B48D] dark:text-[#23C69E]": activeTab === "pinned",
            "text-[#3B3B3B] dark:text-[#EEE]": activeTab !== "pinned",
          })}
        />
        <span className="uppercase text-[12px]">Pinned</span>
        <span
          className={cn("rounded-sm px-[4px] py-[2px] text-[10px] font-semibold", {
            "bg-[#14B48D]/[0.15] dark:bg-[#23C69E]/[0.15]":
              activeTab === "pinned",
            "bg-[#3B3B3B]/[0.11] dark:bg-[#EEE]/[0.15]": activeTab !== "pinned",
          })}
        >
          {pinnedChats.length}
        </span>
      </button>
    </div>
  );
};

export default React.memo(ChatTabs);
