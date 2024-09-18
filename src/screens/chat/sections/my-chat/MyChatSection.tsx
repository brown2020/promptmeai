"use client";

import ButtonIcon from "@/components/v2/ButtonIcon";
import { HiOutlinePlus } from "react-icons/hi";
import ChatTabs from "./components/ChatTabs";
import SearchInput from "./components/SearchInput";
import ChatList from "./components/ChatList";
import { useEffect } from "react";
import { getAllChatDetails } from "@/services/chatService";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { useChatStore } from "@/zustand/useChatStore";
import { useAuthStore } from "@/zustand/useAuthStore";

const MyChatSection = () => {
  const { uid, firebaseUid } = useAuthStore((state) => state);
  const { chats, setChats, setActiveChatId } = useChatSideBarStore(
    (state) => state
  );
  const { setMessages } = useChatStore((state) => state);

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
  };

  return (
    <div className="w-[320px] bg-white p-[15px] flex flex-col gap-[16px]">
      {/* Top section */}
      <div className="flex justify-between items-center gap-[10px]">
        <h2 className="text-[20px] font-bold">My Chats</h2>
        <ButtonIcon icon={HiOutlinePlus} type="primary" onClick={addNewChat} />
      </div>

      <ChatTabs />
      <SearchInput />
      <ChatList chatList={chats} />
    </div>
  );
};

export default MyChatSection;
