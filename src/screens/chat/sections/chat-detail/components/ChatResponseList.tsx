"use client";

import { useChatStore } from "@/zustand/useChatStore";
import ChatResponseEmptyState from "./ChatResponseEmptyState";
import { Fragment, useEffect, useRef } from "react";
import { MODEL_NAMES } from "@/constants/modelNames";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { useUser } from "@clerk/nextjs";
import { getChat } from "@/services/chatService";
import ChatResponseCard from "./ChatResponseCard";
import { UsageMode } from "@/zustand/useProfileStore";

const ChatResponseList = () => {
  const { user } = useUser();
  const { messages, setMessages } = useChatStore();
  const { activeChatId } = useChatSideBarStore();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMessages = async (userId: string, activeChatId: string) => {
      const result = await getChat(userId, activeChatId);

      if (result && result.chat) {
        setMessages(result.chat);
      }
    };

    if (user?.id && activeChatId) {
      updateMessages(user.id, activeChatId);
    }
  }, [activeChatId, setMessages, user?.id]);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full w-full overflow-y-auto flex flex-col gap-[24px] pr-[8px]">
      {messages.length === 0 && <ChatResponseEmptyState />}
      {messages.length > 0 &&
        messages.map((message, i) => (
          <Fragment key={i}>
            <ChatResponseCard
              type="self"
              content={message.userMessage.content as string}
              tokenUsage={
                message.mode === UsageMode.Credits
                  ? message.userMessage?.tokenUsage
                  : undefined
              }
            />

            {MODEL_NAMES.map((model) => {
              const response = message.responses[model.value];
              if (!response) return null;

              return (
                <ChatResponseCard
                  key={model.value}
                  type="ai"
                  aiModel={model.label}
                  content={response.content as string}
                  tokenUsage={
                    message.mode === UsageMode.Credits
                      ? response.tokenUsage
                      : undefined
                  }
                />
              );
            })}
          </Fragment>
        ))}
      {/* Ref to scroll to the bottom */}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatResponseList;
