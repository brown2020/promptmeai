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
import { useAuthStore } from "@/zustand/useAuthStore";
import { WarningChangingMessage } from "@/components/modals";
import { sortChatByDateDesc } from "@/utils/chat";

const MyChatSection = () => {
  const { uid, firebaseUid } = useAuthStore();
  const {
    isDrawerOpen,
    setDrawerOpen,
    setChats,
    setSavedChats,
    setActiveChatId,
  } = useChatSideBarStore();
  const { setMessages, isLoading: anotherActiveRequest } = useChatStore();

  const [showWarning, setShowWarning] = useState<boolean>(false);

  useEffect(() => {
    const getAllChatList = async (userId: string) => {
      try {
        const chats = await getAllChatDetails(userId);
        const sortedChats = sortChatByDateDesc(chats);

        const bookmarkedChats = sortedChats.filter((chat) => chat.bookmarked);
        const nonBookmarkedChats = sortedChats.filter(
          (chat) => !chat.bookmarked
        );

        setChats(nonBookmarkedChats);
        setSavedChats(bookmarkedChats);
      } catch (error) {
        console.error("Error fetching all chat details: ", error);
      }
    };

    if (uid && firebaseUid) {
      getAllChatList(uid);
    }
  }, [firebaseUid, setChats, setSavedChats, uid]);

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
        className={`fixed inset-y-0 left-0 z-50 w-[320px] bg-white p-[15px] flex flex-col gap-[16px] transform transition-transform lg:static lg:translate-x-0 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top section */}
        <div className="flex justify-between items-center gap-[10px]">
          <h2 className="text-[20px] font-bold">My Chats</h2>
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
