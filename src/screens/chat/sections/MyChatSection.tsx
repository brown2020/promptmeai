"use client";

import ButtonIcon from "@/components/v2/ButtonIcon";
import { HiOutlinePlus } from "react-icons/hi";
import ChatTabs from "../components/ChatTabs";
import SearchInput from "../components/SearchInput";
import ChatList from "../components/ChatList";
import { useEffect } from "react";
import { getAllChatDetails } from "@/services/chatService";
import { useUser } from "@clerk/nextjs";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";

const MyChatSection = () => {
  const { user } = useUser();
  const { chats, setChats } = useChatSideBarStore((state) => state);

  useEffect(() => {
    const getAllChatsInfo = async (userId: string) => {
      try {
        const chatDetails = await getAllChatDetails(userId);
        setChats(chatDetails);
      } catch (error) {
        console.error("Error fetching all chat details: ", error);
      }
    };

    if (user?.id) {
      getAllChatsInfo(user.id);
    }
  }, [setChats, user?.id]);

  return (
    <div className="w-[320px] bg-white p-[15px] flex flex-col gap-[16px]">
      {/* Top section */}
      <div className="flex justify-between items-center gap-[10px]">
        <h2 className="text-[20px] font-bold">My Chats</h2>
        <div className="flex gap-[10px]">
          <ButtonIcon icon={HiOutlinePlus} type="primary" />
        </div>
      </div>

      <ChatTabs />
      <SearchInput />
      <ChatList chatList={chats} />
    </div>
  );
};

export default MyChatSection;
