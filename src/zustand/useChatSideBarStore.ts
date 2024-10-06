import { ChatDetail } from "@/types/chat";
import { create } from "zustand";

type ChatStore = {
  isDrawerOpen: boolean;
  isLoadingChat: boolean;
  chats: ChatDetail[];
  activeChatId: string | undefined;
  isNewChat: boolean;
  setDrawerOpen: (value: boolean) => void;
  setChats: (chats: ChatDetail[]) => void;
  addChat: (chat: ChatDetail) => void;
  setActiveChatId: (chatId: string | undefined, isNewChat?: boolean) => void;
};

export const useChatSideBarStore = create<ChatStore>((set) => ({
  isDrawerOpen: false,
  isLoadingChat: true,
  chats: [],
  activeChatId: undefined,
  isNewChat: false,
  setDrawerOpen: (value) => {
    set({ isDrawerOpen: value });
  },
  setChats: (chats) => {
    set({ chats });
    set({ isLoadingChat: false });
  },
  addChat: (chat) =>
    set((state) => ({ chats: [...state.chats, chat], isNewChat: true })),
  setActiveChatId: (chatId, isNewChat = false) =>
    set({
      activeChatId: chatId,
      isNewChat: isNewChat,
    }),
}));
