import create from 'zustand';

type Chat = {
  id: string;
  name?: string; // Assuming each chat has a name for the sidebar
}

type ChatStore = {
  isLoadingChat: boolean;
  chats: Chat[];
  activeChatId: string | undefined;
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  setActiveChatId: (chatId: string | undefined) => void;
}

export const useChatSideBarStore = create<ChatStore>((set) => ({
  isLoadingChat: true,
  chats: [],
  activeChatId: undefined,
  setChats: (chats) => { set({ chats }); set({ isLoadingChat: false }) },
  addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
  setActiveChatId: (chatId) => set({ activeChatId: chatId }),
}));
