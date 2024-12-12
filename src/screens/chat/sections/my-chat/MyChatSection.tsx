"use client";

import { ButtonIcon } from "@/components/buttons";
import { HiOutlinePlus } from "react-icons/hi";
import ChatTabs from "./components/ChatTabs";
import SearchInput from "./components/SearchInput";
import ChatList from "./components/ChatList";
import { Fragment, useCallback, useEffect, useState } from "react";
import { getAllChatDetails } from "@/services/chatService";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { useChatStore } from "@/zustand/useChatStore";
import { WarningChangingMessage } from "@/components/modals";
import { sortChatByDateDesc } from "@/utils/chat";
import useProfileStore from "@/zustand/useProfileStore";
import { User } from "next-auth";

type MyChatSectionProps = {
  user: User | undefined;
};

const MyChatSection = ({ user }: MyChatSectionProps) => {
  const {
    isDrawerOpen,
    setDrawerOpen,
    setChats,
    setPinnedChats,
    setActiveChatId,
  } = useChatSideBarStore();
  const { setMessages, isLoading: anotherActiveRequest } = useChatStore();
  const { profile } = useProfileStore();

  const [showWarning, setShowWarning] = useState<boolean>(false);

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
        console.error("Error fetching all chat details: ", error);
      }
    };

    if (user && profile.email === user.email) {
      if (user.id) {
        getAllChatList(user.id);
      }
    }
  }, [profile.email, setChats, setPinnedChats, user]);

  const addNewChat = useCallback(() => {
    setActiveChatId("");
    setMessages([]);
    setDrawerOpen(false);
  }, [setActiveChatId, setDrawerOpen, setMessages]);

  return (
    <Fragment>
      {/* Drawer backdrop for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[320px] bg-white dark:bg-[#272A2E] p-[15px] flex flex-col gap-[16px] transform transition-transform lg:static lg:translate-x-0 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top section */}
        <div className="flex justify-between items-center gap-[10px]">
          <h2 className="text-[20px] font-bold dark:text-[#FFF]">My Chats</h2>
          <ButtonIcon
            icon={HiOutlinePlus}
            type="primary"
            onClick={() => {
              if (anotherActiveRequest) {
                setShowWarning(true);
              } else {
                addNewChat();
              }
            }}
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
