import { ChatDetail } from "@/types/chat";
import { create } from "zustand";

type Tab = "chats" | "saved";

type ChatStore = {
  isDrawerOpen: boolean;
  isLoadingChat: boolean;
  chats: ChatDetail[];
  savedChats: ChatDetail[];
  activeChatId: string | undefined;
  isNewChat: boolean;
  activeTab: Tab;
  setDrawerOpen: (value: boolean) => void;
  setChats: (chats: ChatDetail[]) => void;
  setSavedChats: (chats: ChatDetail[]) => void;
  addChat: (chat: ChatDetail) => void;
  setActiveChatId: (chatId: string | undefined, isNewChat?: boolean) => void;
  setActiveTab: (tab: Tab) => void;
};

export const useChatSideBarStore = create<ChatStore>((set) => ({
  isDrawerOpen: false,
  isLoadingChat: true,
  chats: [],
  savedChats: [],
  activeChatId: undefined,
  isNewChat: false,
  activeTab: "chats",
  setDrawerOpen: (value) => {
    set({ isDrawerOpen: value });
  },
  setChats: (chats) => {
    set({ chats, isLoadingChat: false });
  },
  setSavedChats: (chats) => {
    set({
      savedChats: chats,
      isLoadingChat: false,
    });
  },
  addChat: (chat) =>
    set((state) => ({ chats: [...state.chats, chat], isNewChat: true })),
  setActiveChatId: (chatId, isNewChat = false) =>
    set({
      activeChatId: chatId,
      isNewChat: isNewChat,
    }),
  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },
}));
