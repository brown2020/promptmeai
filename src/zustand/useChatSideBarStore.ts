import { ChatDetail } from "@/types/chat";
import { create } from "zustand";

type ChatStore = {
  isLoadingChat: boolean;
  chats: ChatDetail[];
  activeChatId: string | undefined;
  setChats: (chats: ChatDetail[]) => void;
  addChat: (chat: ChatDetail) => void;
  setActiveChatId: (chatId: string | undefined) => void;
};

export const useChatSideBarStore = create<ChatStore>((set) => ({
  isLoadingChat: true,
  chats: [],
  activeChatId: undefined,
  setChats: (chats) => {
    set({ chats });
    set({ isLoadingChat: false });
  },
  addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
  setActiveChatId: (chatId) => set({ activeChatId: chatId }),
}));
