import { ChatDetail } from "@/types/chat";
import ChatCard from "./ChatCard";

type ChatGroupedListProps = {
  groupName: string;
  chatList: ChatDetail[];
};

const ChatGroupedList = ({ groupName, chatList }: ChatGroupedListProps) => {
  return (
    <div className="flex flex-col flex-shrink-0 gap-[4px]">
      <h3 className="text-[14px] font-medium text-[#1E1F22] dark:text-[#EEE]">
        {groupName}
      </h3>
      {chatList.map((chat) => (
        <ChatCard key={chat.id} id={chat.id} title={chat.name} />
      ))}
    </div>
  );
};

export default ChatGroupedList;
