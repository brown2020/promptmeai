"use client";

import { useChatStore } from "@/zustand/useChatStore";
import ChatResponseEmptyState from "./ChatResponseEmptyState";
import ChatResponseCard from "./ChatResponseCard";
import { Fragment } from "react";
import { MODEL_NAMES } from "@/constants/modelNames";

const ChatResponseList = () => {
  const messages = useChatStore((state) => state.messages);

  console.log("messages", messages);

  return (
    <div className="h-full w-full overflow-y-auto flex flex-col gap-[24px] pr-[8px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
      {messages.length === 0 && <ChatResponseEmptyState />}
      {messages.length > 0 &&
        messages.map((message, i) => (
          <Fragment key={i}>
            <ChatResponseCard
              type="self"
              date="now"
              content={message.userMessage.content as string}
            />

            {MODEL_NAMES.map((model) => {
              const response = message.responses[model.value];
              if (!response) return;

              return (
                <ChatResponseCard
                  key={model.value}
                  type="ai"
                  aiModel={model.label}
                  date="Now"
                  content={response.content as string}
                />
              );
            })}
          </Fragment>
        ))}
    </div>
  );
};

export default ChatResponseList;
