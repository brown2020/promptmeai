import MyChatSection from "./sections/my-chat";
import ChatDetailSection from "./sections/chat-detail";
import { Fragment } from "react";

const ChatScreen = () => {
  return (
    <Fragment>
      <MyChatSection />
      <ChatDetailSection />
    </Fragment>
  );
};

export default ChatScreen;
