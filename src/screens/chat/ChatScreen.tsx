import LeftPanel from "@/layouts/LeftPanel";
import MyChatSection from "./sections/MyChatSection";
import ChatDetailSection from "./sections/ChatDetailSection";

const ChatScreen = () => {
  return (
    <div className="flex h-screen w-screen">
      <LeftPanel />
      <MyChatSection />
      <ChatDetailSection />
    </div>
  );
};

export default ChatScreen;
