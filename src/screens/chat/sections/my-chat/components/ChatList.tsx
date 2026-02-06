"use client";

import {
  groupChatByDate,
  searchChatByName,
  sortChatByDateDesc,
} from "@/utils/chat";
import ChatGroupedList from "./ChatGroupedList";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import Spinner from "@/components/Spinner";
import EmptyChatList from "./EmptyChatList";
import { memo, useMemo } from "react";

const ChatList = () => {
  const { isLoadingChat, chats, pinnedChats, activeTab, searchTerm } =
    useChatSideBarStore();

  const activeChats = activeTab === "chats" ? chats : pinnedChats;

  const filteredChats = useMemo(() => {
    const sorted = sortChatByDateDesc(activeChats);
    if (!searchTerm) return sorted;
    return searchChatByName(sorted, searchTerm);
  }, [activeChats, searchTerm]);

  const groupedData = useMemo(
    () => groupChatByDate(filteredChats),
    [filteredChats]
  );

  if (isLoadingChat) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100%-200px)]">
        <Spinner message="Preparing your content..." />
      </div>
    );
  }

  if (activeChats.length === 0) {
    return <EmptyChatList />;
  }

  if (filteredChats.length === 0) {
    return <EmptyChatList message="No chats match your search." />;
  }

  return (
    <div className="flex flex-col gap-[8px] overflow-y-auto scrollable-container">
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

export default memo(ChatList);
