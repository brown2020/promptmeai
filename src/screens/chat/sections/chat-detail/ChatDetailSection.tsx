"use client";

import { useEffect, useState } from "react";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import ChatDetailActions from "./components/ChatDetailActions";
import ChatInput from "./components/ChatInput";
import ChatResponseList from "./components/ChatResponseList";
import { useTypingEffect } from "@/hooks";
import { trimText } from "@/utils/text";
import { RxHamburgerMenu } from "react-icons/rx";

const ChatDetailSection = () => {
  const {
    activeChatId,
    chats,
    pinnedChats,
    isNewChat,
    activeTab,
    setDrawerOpen,
  } = useChatSideBarStore((state) => state);
  const [title, setTitle] = useState<string>("");
  const typedTitle = useTypingEffect(title, 100);

  useEffect(() => {
    const formatedTitle = trimText(
      activeTab === "chats"
        ? chats.find((chat) => chat.id === activeChatId)?.name || ""
        : pinnedChats.find((chat) => chat.id === activeChatId)?.name || ""
    );

    setTitle(formatedTitle);
  }, [activeChatId, activeTab, chats, pinnedChats]);

  return (
    <div className="w-full h-full p-[16px] flex flex-col gap-[16px] overflow-hidden">
      {/* Top section */}
      <div className="flex justify-between items-center gap-4">
        <RxHamburgerMenu
          size={24}
          className="lg:hidden cursor-pointer flex-shrink-0"
          onClick={() => setDrawerOpen(true)}
        />
        <h3 className="text-[18px] whitespace-nowrap overflow-hidden text-ellipsis text-[#1E1F22]">
          {isNewChat ? typedTitle : title}
        </h3>
        <ChatDetailActions />
      </div>
      {/* Main chat detail section */}
      <div className="bg-[#F5F5F5] h-[calc(100%-48px)] w-[calc(100% + 32px)] rounded-lg lg:ml-[-16px] flex justify-center px-[18px] sm:px-[24px]">
        {/* Wrapper */}
        <div className="h-full w-full max-w-[736px] flex flex-col gap-[18px] sm:gap-[24px] justify-between items-center py-[18px] sm:py-[24px]">
          <ChatResponseList />
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default ChatDetailSection;
