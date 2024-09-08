import { create } from "zustand";
import { type CoreMessage } from "ai";

export type Message = {
  userMessage: CoreMessage;
  responses: Record<string, CoreMessage>;
};

type ChatStore = {
  messages: Message[];
  addMessage: (userMessage: CoreMessage) => void;
  addResponse: (model: string, response: CoreMessage) => void;
  setMessages: (
    messages: Message[] | ((prevMessages: Message[]) => Message[])
  ) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,

  // Function to add a new user message
  addMessage: (userMessage) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          userMessage,
          responses: {},
        },
      ],
    })),

  // Function to add a response from a model
  addResponse: (model, response) =>
    set((state) => {
      const lastMessageIndex = state.messages.length - 1;
      if (lastMessageIndex < 0) return state; // Ensure there is at least one message

      const updatedMessages = [...state.messages];
      updatedMessages[lastMessageIndex] = {
        ...updatedMessages[lastMessageIndex],
        responses: {
          ...updatedMessages[lastMessageIndex].responses,
          [model]: response,
        },
      };

      return { messages: updatedMessages };
    }),

  // Function to set multiple messages or update messages using a function
  setMessages: (messagesOrUpdater) =>
    set((state) => ({
      messages:
        typeof messagesOrUpdater === "function"
          ? messagesOrUpdater(state.messages)
          : messagesOrUpdater,
    })),

  // Function to set the loading state
  setIsLoading: (isLoading) =>
    set(() => ({
      isLoading,
    })),
}));
