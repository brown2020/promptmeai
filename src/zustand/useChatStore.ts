import create from "zustand";
import { type CoreMessage } from "ai";

interface ChatState {
  messages: Record<string, CoreMessage[]>;
  addMessage: (model: string, message: CoreMessage) => void;
  setMessages: (model: string, messages: CoreMessage[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: {},
  addMessage: (model, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [model]: [...(state.messages[model] || []), message],
      },
    })),
  setMessages: (model, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [model]: messages,
      },
    })),
}));
