"use client";

import { useChatStore } from "@/zustand/useChatStore";
import ChatResponseEmptyState from "./ChatResponseEmptyState";

const ChatResponseList = () => {
  const messages = useChatStore((state) => state.messages);

  console.log("messages", messages);

  return (
    <div className="h-full w-full overflow-y-auto flex flex-col gap-[24px] pr-[8px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
      {messages.length === 0 && <ChatResponseEmptyState />}
    </div>
  );
};

export default ChatResponseList;
