"use client";

import { groupChatByDate, sortChatByDateDesc } from "@/utils/chat";
import ChatGroupedList from "./ChatGroupedList";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import Spinner from "@/components/Spinner";

const ChatList = () => {
  const { isLoadingChat, chats } = useChatSideBarStore();

  const chatSortedDesc = sortChatByDateDesc(chats);
  const groupedData = groupChatByDate(chatSortedDesc);

  return (
    <div className="flex flex-col gap-[8px] overflow-y-auto scrollable-container">
      {isLoadingChat && <Spinner />}
      {groupedData.today.length > 0 && (
        <ChatGroupedList groupName="Today" chatList={groupedData.today} />
      )}
      {groupedData.yesterday.length > 0 && (
        <ChatGroupedList
          groupName="Yesterday"
          chatList={groupedData.yesterday}
        />
      )}
      {groupedData.previous7Days.length > 0 && (
        <ChatGroupedList
          groupName="Previous 7 Days"
          chatList={groupedData.previous7Days}
        />
      )}
      {groupedData.previous30Days.length > 0 && (
        <ChatGroupedList
          groupName="Previous 30 Days"
          chatList={groupedData.previous30Days}
        />
      )}
    </div>
  );
};

export default ChatList;
