"use client";

import { useEffect, useState } from "react";
import { type CoreMessage } from "ai";
import { MODELNAMES } from "@/constants/modelNames";
import { continueConversation } from "@/actions/generateActions";
import { readStreamableValue } from "ai/rsc";
import { useChatStore } from "@/zustand/useChatStore";
import { useUser } from "@clerk/nextjs";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import {
  getAllChatDetails,
  getChat,
  saveChat,
  updateChat,
} from "@/services/chatService";
import Spinner from "./Spinner";
import { ModelChat } from "./ModelChat";

export default function ChatCompare() {
  const [input, setInput] = useState("");
  const { user } = useUser();

  const { messages, addMessage, setMessages, isLoading, setIsLoading } =
    useChatStore((state) => state);
  const { activeChatId, isLoadingChat, setActiveChatId, setChats } =
    useChatSideBarStore((state) => state);

  useEffect(() => {
    const getAllChatsInfo = async () => {
      if (user?.id) {
        const chatDetails = await getAllChatDetails(user?.id);
        setChats(chatDetails);
      }
    };
    getAllChatsInfo();
  }, [user?.id, activeChatId, setChats]);

  useEffect(() => {
    const getChatDetail = async () => {
      if (user?.id && activeChatId) {
        const filterChat = await getChat(user?.id, activeChatId || "");
        if (filterChat) {
          setMessages(JSON.parse(filterChat.chat));
        }
      }
      setIsLoading?.(false);
    };

    getChatDetail();
  }, [activeChatId, setIsLoading, setMessages, user?.id]);

  const saveChatFunction = async (messages: any) => {
    if (activeChatId) {
      await updateChat(user, activeChatId, messages);
    } else {
      const chatId = await saveChat(user, messages);
      setActiveChatId(chatId);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;
    const newUserMessage: CoreMessage = { content: input, role: "user" };
    addMessage(newUserMessage);
    setInput("");

    await Promise.all(
      MODELNAMES.map(async (model) => {
        try {
          await getAssistantResponse(model.value, newUserMessage);
        } catch (error) {
          console.log("ERROR: ", error);
          return null;
        }
      })
    );
    const messages = useChatStore.getState().messages;
    saveChatFunction(messages);
  };

  const getAssistantResponse = async (
    model: string,
    userMessage: CoreMessage
  ) => {
    const currentMessages: CoreMessage[] = [];
    messages.forEach((message) => {
      if (message.userMessage) {
        currentMessages.push(message.userMessage);
      }
      if (message.responses[model]) {
        currentMessages.push(message.responses[model]);
      }
    });
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
  };

  return (
    <div className="flex flex-col h-full w-full mx-auto">
      {isLoading || isLoadingChat ? (
        <Spinner />
      ) : (
        <>
          <div className="flex-1 overflow-auto p-4 mb-10">
            <div className="space-y-4">
              <ModelChat />
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="fixed bottom-1 z-10 w-4/5 px-5 border-t border-gray-200 "
          >
            <input
              className="w-full p-2 border border-gray-300 rounded shadow-xl"
              value={input}
              placeholder="Say something..."
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
        </>
      )}
    </div>
  );
}
