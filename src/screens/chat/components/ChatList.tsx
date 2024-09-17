import { ChatDetail } from "@/types/chat";
import ChatCard from "./ChatCard";

type ChatListProps = {
  chatList: ChatDetail[];
};

const ChatList = ({ chatList }: ChatListProps) => {
  return (
    <div className="flex flex-col flex-shrink-0 gap-[8px]">
      {chatList.map((chat) => (
        <ChatCard key={chat.id} id={chat.id} title={chat.name} />
      ))}
    </div>
  );
};

export default ChatList;
