import { create } from 'zustand';
import { type CoreMessage } from 'ai';

export type Message = {
  userMessage: CoreMessage;
  responses: Record<string, CoreMessage>;
};

type ChatStore = {
  messages: Message[]; // Store messages by model name
  addMessage: (userMessage: CoreMessage) => void; // Function to add a single message
  addResponse: (model: string, response: CoreMessage) => void; // Function to set AI responses
  setMessages: (messages: Message[]) => void;  // Function to set multiple messages
  isLoading?: boolean;
  setIsLoading?: (isLoading: boolean) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
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
  addResponse: (model, response) =>
    set((state) => {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];

      if (lastMessage) {
        lastMessage.responses[model] = response;
      }
      return { messages };
    }),

  // Function to set an entire array of messages
  setMessages: (messages) => {
    set(() => ({
      messages,
    }));
  },
  setIsLoading: (isLoading) =>

    set((state) => ({
      isLoading,
    })),
}));