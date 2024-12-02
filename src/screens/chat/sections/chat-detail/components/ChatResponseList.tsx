"use client";

import { useChatStore } from "@/zustand/useChatStore";
import ChatResponseEmptyState from "./ChatResponseEmptyState";
import { Fragment, useEffect, useRef } from "react";
import { MODEL_NAMES } from "@/constants/modelNames";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { getChat } from "@/services/chatService";
import ChatResponseCard from "./ChatResponseCard";
import { UsageMode } from "@/zustand/useProfileStore";
import { User } from "next-auth";

type ChatResponseListProps = {
  user?: User;
};

const ChatResponseList = ({ user }: ChatResponseListProps) => {
  const { messages, setMessages } = useChatStore();
  const { activeChatId } = useChatSideBarStore();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAutoScrollEnabled = useRef(true);

  // Handle initial chat load
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

  // Handle scroll events to detect if user has scrolled up
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 100;
      isAutoScrollEnabled.current = scrolledToBottom;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle auto-scrolling during streaming
  useEffect(() => {
    if (!isAutoScrollEnabled.current) return;

    const scrollToBottom = () => {
      if (endOfMessagesRef.current) {
        endOfMessagesRef.current.scrollIntoView({ behavior: "auto" });
      }
    };

    // Use requestAnimationFrame for smooth scrolling during streaming
    requestAnimationFrame(scrollToBottom);
  }, [messages]); // This will trigger on every message update, including streaming updates

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-y-auto flex flex-col gap-[24px] pr-[8px]"
    >
      {messages.length === 0 && <ChatResponseEmptyState user={user} />}
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
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatResponseList;
