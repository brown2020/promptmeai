"use client";

import { useEffect, useState, useCallback } from "react";
import { type CoreMessage } from "ai";
import { MODEL_NAMES } from "@/constants/modelNames";
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
  Message,
} from "@/services/chatService";
import { ModelChat } from "./ModelChat";
import { ClipLoader } from "react-spinners";

// Chat input form component
const ChatInputForm: React.FC<{
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}> = ({ handleSubmit, input, setInput }) => (
  <form
    onSubmit={handleSubmit}
    className="fixed bottom-1 z-10 w-4/5 px-5 border-t border-gray-200"
  >
    <input
      className="w-full p-2 border border-gray-300 rounded shadow-xl"
      value={input}
      placeholder="Say something..."
      onChange={(e) => setInput(e.target.value)}
    />
  </form>
);

export default function ChatCompare() {
  const [input, setInput] = useState("");
  const { user } = useUser();
  const { messages, addMessage, setMessages, isLoading, setIsLoading } =
    useChatStore((state) => state);
  const { activeChatId, isLoadingChat, setActiveChatId, setChats, addChat } =
    useChatSideBarStore((state) => state);

  // Fetch all chat details when the user ID is available
  useEffect(() => {
    const getAllChatsInfo = async () => {
      if (user?.id) {
        try {
          const chatDetails = await getAllChatDetails(user.id);
          setChats(chatDetails);
        } catch (error) {
          console.error("Error fetching all chat details: ", error);
        }
      }
    };

    if (user?.id) {
      getAllChatsInfo();
    }
  }, [user?.id, setChats]);

  // Fetch details for the active chat when it changes
  useEffect(() => {
    const getChatDetail = async () => {
      if (user?.id && activeChatId) {
        setIsLoading(true);
        try {
          const filterChat = await getChat(user.id, activeChatId);
          if (filterChat) {
            const parsedMessages: Message[] = filterChat.chat; // Assuming filterChat.chat is already of type Message[]
            setMessages((prevMessages: Message[]) => {
              const newMessages = parsedMessages.filter(
                (message) =>
                  !prevMessages.some(
                    (prevMessage) =>
                      prevMessage.userMessage.content ===
                        message.userMessage.content &&
                      prevMessage.userMessage.role === message.userMessage.role
                  )
              );
              return [...prevMessages, ...newMessages];
            });
          }
        } catch (error) {
          console.error("Error fetching chat details:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (activeChatId) {
      getChatDetail();
    }
  }, [activeChatId, setIsLoading, setMessages, user?.id]);

  const saveChatFunction = useCallback(
    async (coreMessages: CoreMessage[]) => {
      if (user?.id) {
        const formattedMessages: Message[] = coreMessages.map(
          (coreMessage) => ({
            userMessage: coreMessage,
            responses: {},
          })
        );

        try {
          if (activeChatId) {
            await updateChat(user.id, activeChatId, formattedMessages);
          } else {
            const chat = await saveChat(
              user.id,
              user.fullName || "",
              formattedMessages
            );
            if (chat?.id) {
              addChat(chat);
              setActiveChatId(chat.id);
            }
          }
        } catch (error) {
          console.error("Error saving or updating chat: ", error);
        }
      }
    },
    [user?.id, user?.fullName, activeChatId, addChat, setActiveChatId]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

      const updatedMessages: CoreMessage[] = useChatStore
        .getState()
        .messages.map((msg) => msg.userMessage);

      await saveChatFunction(updatedMessages);
    } catch (error) {
      console.error("Error handling submission: ", error);
    }
  };

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

  return (
    <div className="flex flex-col h-full w-full mx-auto">
      {isLoading || isLoadingChat ? (
        <ClipLoader size={30} color="#ffffff" />
      ) : (
        <>
          <div className="flex-1 overflow-auto p-4 mb-10">
            <div className="space-y-4">
              <ModelChat />
            </div>
          </div>
          <ChatInputForm
            handleSubmit={handleSubmit}
            input={input}
            setInput={setInput}
          />
        </>
      )}
    </div>
  );
}
