import ChatCard from "./ChatCard";

const ChatList = () => {
  return (
    <div className="flex flex-col flex-shrink-0 gap-[8px]">
      <ChatCard
        title="Warning Messages Samples"
        description="Some 15 billion years ago the universe emerged from a hot, dense sea of..."
        time="Now"
        isActive
      />
      <ChatCard
        title="Competitive Analysis research"
        description="A competitive analysis of restaurant delivery mobile applications reveals key insights ..."
        time="Thu"
      />
      <ChatCard
        title="Competitive Analysis research 2"
        description="A competitive analysis of restaurant delivery mobile applications reveals key insights ..."
        time="Fri"
      />
    </div>
  );
};

export default ChatList;
