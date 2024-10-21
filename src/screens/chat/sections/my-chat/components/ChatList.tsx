"use client";

import { ChatGroups, groupChatByDate } from "@/utils/chat";
import ChatGroupedList from "./ChatGroupedList";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import Spinner from "@/components/Spinner";
import EmptyChatList from "./EmptyChatList";
import { useEffect, useMemo, useState } from "react";

const ChatList = () => {
  const { isLoadingChat, chats, savedChats, activeTab } = useChatSideBarStore();

  const [groupedData, setGroupedData] = useState<ChatGroups>();

  const chatGroupedData = useMemo(() => groupChatByDate(chats), [chats]);
  const savedChatGroupedData = useMemo(
    () => groupChatByDate(savedChats),
    [savedChats]
  );

  useEffect(() => {
    switch (activeTab) {
      case "chats": {
        return setGroupedData(chatGroupedData);
      }
      case "saved": {
        return setGroupedData(savedChatGroupedData);
      }
    }
  }, [activeTab, chatGroupedData, savedChatGroupedData]);

  if (isLoadingChat)
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100%-200px)]">
        <Spinner message="Preparing your content..." />
      </div>
    );

  if (chats.length === 0) {
    return <EmptyChatList />;
  }

  return (
    <div className="flex flex-col gap-[8px] overflow-y-auto scrollable-container">
      {groupedData && groupedData.today.length > 0 && (
        <ChatGroupedList groupName="Today" chatList={groupedData.today} />
      )}
      {groupedData && groupedData.yesterday.length > 0 && (
        <ChatGroupedList
          groupName="Yesterday"
          chatList={groupedData.yesterday}
        />
      )}
      {groupedData && groupedData.previous7Days.length > 0 && (
        <ChatGroupedList
          groupName="Previous 7 Days"
          chatList={groupedData.previous7Days}
        />
      )}
      {groupedData && groupedData.previous30Days.length > 0 && (
        <ChatGroupedList
          groupName="Previous 30 Days"
          chatList={groupedData.previous30Days}
        />
      )}
    </div>
  );
};

export default ChatList;
