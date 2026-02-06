import { ChatDetail } from "@/types/chat";
import { create } from "zustand";

type ActiveTab = "chats" | "pinned";

type ChatStore = {
  isDrawerOpen: boolean;
  isLoadingChat: boolean;
  chats: ChatDetail[];
  pinnedChats: ChatDetail[];
  activeChatId: string | undefined;
  isNewChat: boolean;
  activeTab: ActiveTab;
  searchTerm: string;
  setDrawerOpen: (value: boolean) => void;
  setChats: (chats: ChatDetail[]) => void;
  setPinnedChats: (chats: ChatDetail[]) => void;
  addChat: (chat: ChatDetail) => void;
  setActiveChatId: (chatId: string | undefined, isNewChat?: boolean) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setSearchTerm: (term: string) => void;
};

export const useChatSideBarStore = create<ChatStore>((set) => ({
  isDrawerOpen: false,
  isLoadingChat: true,
  chats: [],
  pinnedChats: [],
  activeChatId: undefined,
  isNewChat: false,
  activeTab: "chats",
  searchTerm: "",
  setDrawerOpen: (value) => {
    set({ isDrawerOpen: value });
  },
  setChats: (chats) => {
    set({ chats, isLoadingChat: false });
  },
  setPinnedChats: (chats) => {
    set({
      pinnedChats: chats,
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
  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },
}));
