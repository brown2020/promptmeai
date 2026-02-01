"use client";

import { ButtonIcon } from "@/components/buttons";
import { HiOutlinePlus } from "react-icons/hi";
import ChatTabs from "./components/ChatTabs";
import SearchInput from "./components/SearchInput";
import ChatList from "./components/ChatList";
import { Fragment, useCallback, useEffect } from "react";
import { getAllChatDetails } from "@/services/chatService";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { useChatStore } from "@/zustand/useChatStore";
import { useAuthStore } from "@/zustand/useAuthStore";
import { WarningChangingMessage } from "@/components/modals";
import { sortChatByDateDesc } from "@/utils/chat";
import { useActiveRequestWarning } from "@/hooks";
import toast from "react-hot-toast";
import { logger } from "@/utils/logger";

const MyChatSection = () => {
  const { uid } = useAuthStore();
  const {
    isDrawerOpen,
    setDrawerOpen,
    setChats,
    setPinnedChats,
    setActiveChatId,
  } = useChatSideBarStore();
  const { setMessages } = useChatStore();

  const { showWarning, setShowWarning, executeWithWarning } =
    useActiveRequestWarning();

  useEffect(() => {
    const getAllChatList = async (userId: string) => {
      try {
        const chats = await getAllChatDetails(userId);
        const sortedChats = sortChatByDateDesc(chats);

        const nonPinnedChats = sortedChats.filter((chat) => !chat.pinned);
        const pinnedChats = sortedChats.filter((chat) => chat.pinned);

        setChats(nonPinnedChats);
        setPinnedChats(pinnedChats);
      } catch (error) {
        logger.error("Error fetching all chat details:", error);
        toast.error("Failed to load chats. Please refresh the page.");
      }
    };

    if (uid) {
      getAllChatList(uid);
    }
  }, [setChats, setPinnedChats, uid]);

  const addNewChat = useCallback(() => {
    setActiveChatId("");
    setMessages([]);
    setDrawerOpen(false);
  }, [setActiveChatId, setDrawerOpen, setMessages]);

  return (
    <Fragment>
      {/* Drawer backdrop for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
          isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 p-4 flex flex-col gap-4 transform transition-transform lg:static lg:translate-x-0 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top section */}
        <div className="flex justify-between items-center gap-2.5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Chats</h2>
          <ButtonIcon
            icon={HiOutlinePlus}
            type="primary"
            onClick={() => executeWithWarning(addNewChat)}
          />
        </div>

        <ChatTabs />
        <SearchInput />
        <ChatList />
      </div>

      {/* Warning for the new message if there is active request */}
      <WarningChangingMessage
        showWarning={showWarning}
        setShowWarning={setShowWarning}
        onFinish={addNewChat}
      />
    </Fragment>
  );
};

export default MyChatSection;
