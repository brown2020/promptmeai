import create from "zustand";
import { type CoreMessage } from "ai";

// Define the ChatState interface
interface ChatState {
  messages: Record<string, CoreMessage[]>; // Store messages by model name
  addMessage: (model: string, message: CoreMessage) => void; // Function to add a single message
  setMessages: (model: string, messages: CoreMessage[]) => void; // Function to set multiple messages
}

// Zustand store for managing chat messages
export const useChatStore = create<ChatState>((set) => ({
  messages: {}, // Initialize messages as an empty object

  // Function to add a new message to a specific model
  addMessage: (model, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [model]: [...(state.messages[model] || []), message],
      },
    })),

  // Function to set an entire array of messages for a specific model
  setMessages: (model, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [model]: messages,
      },
    })),
}));
