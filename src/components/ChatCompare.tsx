"use client";

import { useEffect, useState } from "react";
import { type CoreMessage } from "ai";
import { MODELNAMES } from "@/constants/modelNames";
import { continueConversation } from "@/actions/generateActions";
import { readStreamableValue } from "ai/rsc";
import { useChatStore } from "@/zustand/useChatStore";
import { useUser } from "@clerk/nextjs";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { getAllChatDetails, getChat, saveChat, updateChat } from "@/services/chatService";
import Spinner from "./Spinner";
import MarkdownComponent from "./MarkdownComponent";

export default function ChatCompare() {
  const [input, setInput] = useState("");
  const { isLoaded, isSignedIn, user } = useUser();

  const { messages, addMessage, setMessages, isLoading, setIsLoading } = useChatStore((state) => state);
  const { activeChatId, isLoadingChat, setActiveChatId, setChats } = useChatSideBarStore((state) => state);

  useEffect(() => {
    const getAllChatsInfo = async () => {
      if (user?.id) {
        const chatDetails = await getAllChatDetails(user?.id);
        setChats(chatDetails);
      }
    }
    getAllChatsInfo()
  }, [user?.id, activeChatId]);

  useEffect(() => {
    const getChatDetail = async () => {
      if (user?.id && activeChatId) {
        const filterChat = await getChat(user?.id, activeChatId || '');
        if (filterChat) {
          setMessages(JSON.parse(filterChat.chat));
        }
      }
      setIsLoading?.(false);
    }

    getChatDetail();
  }, [activeChatId])

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
    const result = await continueConversation(
      [userMessage],
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
              {messages.map((message, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex flex-col items-end">
                    <div className="w-max mb-2 border rounded-lg bg-blue-400 p-2 shadow-sm">
                      <div className="text-left text-white">
                        {typeof message.userMessage.content === 'string'
                          ? message.userMessage.content
                          : JSON.stringify(message.userMessage.content)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-2">
                    {MODELNAMES.map((model) => {
                      const response = message.responses[model.value];
                      return response ? (
                        <div key={model.value} className="p-2 border rounded-lg bg-gray-100 shadow-sm">
                          <div className="font-semibold text-gray-700">{model.label}:</div>
                          <div className="mt-2 text-gray-600 pt-2 px-10">
                            <MarkdownComponent markdownText={response.content as string} />
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="fixed bottom-1 z-10 w-4/5 px-5 border-t border-gray-200 ">
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
