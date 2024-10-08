"use client";

import { ButtonIcon } from "@/components/buttons";
import { HiOutlinePlus } from "react-icons/hi";
import ChatTabs from "./components/ChatTabs";
import SearchInput from "./components/SearchInput";
import ChatList from "./components/ChatList";
import { Fragment, useEffect } from "react";
import { getAllChatDetails } from "@/services/chatService";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { useChatStore } from "@/zustand/useChatStore";
import { useAuthStore } from "@/zustand/useAuthStore";

const MyChatSection = () => {
  const { uid, firebaseUid } = useAuthStore();
  const { isDrawerOpen, setDrawerOpen, setChats, setActiveChatId } =
    useChatSideBarStore();
  const { setMessages } = useChatStore();

  useEffect(() => {
    const getAllChatList = async (userId: string) => {
      try {
        const chatDetails = await getAllChatDetails(userId);
        setChats(chatDetails);
      } catch (error) {
        console.error("Error fetching all chat details: ", error);
      }
    };

    if (uid && firebaseUid) {
      getAllChatList(uid);
    }
  }, [firebaseUid, setChats, uid]);

  const addNewChat = () => {
    setActiveChatId("");
    setMessages([]);
    setDrawerOpen(false);
  };

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
            onClick={addNewChat}
          />
        </div>

        <ChatTabs />
        <SearchInput />
        <ChatList />
      </div>
    </Fragment>
  );
};

export default MyChatSection;
