"use client";

import { continueConversation } from "@/actions/generateActions";
import { MODEL_NAMES } from "@/constants/modelNames";
import { Message, saveChat, updateChat } from "@/services/chatService";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { useChatStore } from "@/zustand/useChatStore";
import { useUser } from "@clerk/nextjs";
import { CoreMessage } from "ai";
import { readStreamableValue } from "ai/rsc";
import { useCallback, useEffect, useRef, useState } from "react";
import { PiPaperPlaneTilt } from "react-icons/pi";

const ChatInput = () => {
  const { user } = useUser();
  const { messages, addMessage } = useChatStore((state) => state);
  const { activeChatId, setActiveChatId } = useChatSideBarStore(
    (state) => state
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState<string>("");

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Automatically focus the input
    }
  }, []);

  const getAssistantResponse = useCallback(
    async (model: string, userMessage: CoreMessage) => {
      const currentMessages: CoreMessage[] = messages.flatMap((message) => [
        message.userMessage,
        ...Object.values(message.responses),
      ]);

      const result = await continueConversation(
        [...currentMessages, userMessage],
        model
      );

      for await (const content of readStreamableValue(result)) {
        useChatStore.getState().addResponse(model, {
          role: "assistant",
          content: content as string,
        });
      }
    },
    [messages]
  );

  const saveChatFunction = useCallback(
    async (messages: Message[]) => {
      if (user?.id) {
        try {
          if (activeChatId) {
            await updateChat(user.id, activeChatId, messages);
          } else {
            const chatId = await saveChat(
              user.id,
              user.fullName || "",
              messages
            );
            if (chatId) {
              setActiveChatId(chatId);
            }
          }
        } catch (error) {
          console.error("Error saving or updating chat: ", error);
        }
      }
    },
    [activeChatId, user?.id, user?.fullName, setActiveChatId]
  );

  const submitHandler = async () => {
    if (!input) return;

    const newUserMessage: CoreMessage = { content: input, role: "user" };
    addMessage(newUserMessage);
    setInput("");

    try {
      await Promise.all(
        MODEL_NAMES.map((model) =>
          getAssistantResponse(model.value, newUserMessage)
        )
      );

      const updatedMessages: Message[] = useChatStore
        .getState()
        .messages.map((msg) => msg);

      await saveChatFunction(updatedMessages);
    } catch (error) {
      console.error("Error handling submission: ", error);
    }
  };

  return (
    <div className="self-end w-full max-w-[720px] h-[56px] flex-shrink-0 flex gap-[16px] justify-center items-center">
      <div className="w-full bg-white rounded-xl shadow px-[16px] py-[12px] flex gap-[12px] items-center">
        <input
          ref={inputRef}
          className="w-full text-[14px] text-[#A0A7BB] outline-none"
          placeholder="Type your question here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitHandler()}
        />
        <div className="flex items-center justify-center h-[32px] w-[32px] rounded-lg cursor-pointer flex-shrink-0 mr-[-4px]">
          <PiPaperPlaneTilt size={18} color="#ABABAB" />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
