import { create } from "zustand";
import { type CoreMessage } from "ai";
import useProfileStore, { UsageMode } from "./useProfileStore";

export type PromptCoreMessage = {
  tokenUsage?: number;
} & CoreMessage;

export type Message = {
  mode: UsageMode;
  userMessage: PromptCoreMessage;
  responses: Record<string, PromptCoreMessage>;
};

type ChatStore = {
  messages: Message[];
  addMessage: (userMessage: PromptCoreMessage) => void;
  addResponse: (model: string, response: PromptCoreMessage) => void;
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
  addMessage: (userMessage) => {
    const { profile } = useProfileStore.getState();

    set((state) => ({
      messages: [
        ...state.messages,
        {
          mode: profile.usageMode,
          userMessage,
          responses: {},
        },
      ],
    }));
  },

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
