import { create } from 'zustand';
import { type CoreMessage } from 'ai';

export type Message = {
  userMessage: CoreMessage;
  responses: Record<string, CoreMessage>;
};

type ChatStore = {
  messages: Message[];
  addMessage: (userMessage: CoreMessage) => void;
  addResponse: (model: string, response: CoreMessage) => void;
  setMessages: (messages: Message[]) => void;  
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