"use client";

import { PiChatsCircleFill } from "react-icons/pi";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { cn } from "@/utils/tailwind";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { TbPinnedFilled } from "react-icons/tb";
import React, { useEffect } from "react";

const ChatTabs = () => {
  const chats = useChatSideBarStore((state) => state.chats);
  const pinnedChats = useChatSideBarStore((state) => state.pinnedChats);
  const activeTab = useChatSideBarStore((state) => state.activeTab);
  const setActiveTab = useChatSideBarStore((state) => state.setActiveTab);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("tab");
    if (raw === "pinned" || raw === "chats") {
      setActiveTab(raw);
      return;
    }
    setActiveTab(useChatSideBarStore.getState().activeTab);
  }, [setActiveTab]);

  const buttonWidth = 135.5;
  const gapBetweenButtons = 10;

  return (
    <LazyMotion features={domAnimation}>
    <div role="group" aria-label="Chat lists" className="bg-[#EEE] dark:bg-[#3F424A] rounded-xl border-[0.6px] border-[#E2E2E2] dark:border-[#3F424A] h-[48px] flex gap-[10px] shrink-0 p-[4px] relative">
      <m.div
        className="absolute top-[4px] bottom-[4px] left-[4px] w-[135.5px] bg-white dark:bg-[#1E1F22] rounded-lg shadow-lg"
        initial={false}
        animate={{
          x: activeTab === "chats" ? 0 : buttonWidth + gapBetweenButtons,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      <button
        type="button"
        aria-pressed={activeTab === "chats"}
        className={cn(
          "relative z-10 flex h-full w-[135.5px] items-center justify-center gap-[6px] rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A8F70]",
          {
            "text-[#0B6B52] dark:text-[#7DDFC4] font-semibold":
              activeTab === "chats",
            "text-[#3B3B3B] dark:text-[#EEE]": activeTab !== "chats",
          }
        )}
        onClick={() => setActiveTab("chats")}
      >
        <PiChatsCircleFill
          size={14}
          aria-hidden
          className={cn({
            "text-[#0B6B52] dark:text-[#7DDFC4]": activeTab === "chats",
            "text-[#3B3B3B] dark:text-[#EEE]": activeTab !== "chats",
          })}
        />
        <span className="uppercase text-[12px]">Chats</span>
        <span
          className={cn("rounded-sm px-[4px] py-[2px] text-[10px] font-semibold tabular-nums", {
            "bg-[#14B48D]/[0.15] dark:bg-[#23C69E]/[0.15]":
              activeTab === "chats",
            "bg-[#3B3B3B]/[0.11] dark:bg-[#EEE]/[0.15]": activeTab !== "chats",
          })}
        >
          {chats.length}
        </span>
      </button>

      <button
        type="button"
        aria-pressed={activeTab === "pinned"}
        className={cn(
          "relative z-10 flex h-full w-[135.5px] items-center justify-center gap-[6px] rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A8F70]",
          {
            "text-[#0B6B52] dark:text-[#7DDFC4] font-semibold":
              activeTab === "pinned",
            "text-[#3B3B3B] dark:text-[#EEE]": activeTab !== "pinned",
          }
        )}
        onClick={() => setActiveTab("pinned")}
      >
        <TbPinnedFilled
          size={14}
          aria-hidden
          className={cn({
            "text-[#0B6B52] dark:text-[#7DDFC4]": activeTab === "pinned",
            "text-[#3B3B3B] dark:text-[#EEE]": activeTab !== "pinned",
          })}
        />
        <span className="uppercase text-[12px]">Pinned</span>
        <span
          className={cn("rounded-sm px-[4px] py-[2px] text-[10px] font-semibold tabular-nums", {
            "bg-[#14B48D]/[0.15] dark:bg-[#23C69E]/[0.15]":
              activeTab === "pinned",
            "bg-[#3B3B3B]/[0.11] dark:bg-[#EEE]/[0.15]": activeTab !== "pinned",
          })}
        >
          {pinnedChats.length}
        </span>
      </button>
    </div>
    </LazyMotion>
  );
};

export default React.memo(ChatTabs);
