import MyChatSection from "./sections/my-chat";
import ChatDetailSection from "./sections/chat-detail";
import { Fragment } from "react";

type ChatScreenProps = {
  userId: string;
};

const ChatScreen = ({ userId }: ChatScreenProps) => {
  return (
    <Fragment>
      <MyChatSection userId={userId} />
      <ChatDetailSection />
    </Fragment>
  );
};

export default ChatScreen;
