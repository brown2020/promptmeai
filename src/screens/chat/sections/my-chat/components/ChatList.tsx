import { ChatDetail } from "@/types/chat";
import { groupChatByDate, sortChatByDateDesc } from "@/utils/chat";
import ChatGroupedList from "./ChatGroupedList";

type ChatListProps = {
  chatList: ChatDetail[];
};

const ChatList = ({ chatList }: ChatListProps) => {
  const chatSortedDesc = sortChatByDateDesc(chatList);
  const groupedData = groupChatByDate(chatSortedDesc);

  return (
    <div className="flex flex-col gap-[8px]">
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
