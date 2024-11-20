import MyChatSection from "./sections/my-chat";
import ChatDetailSection from "./sections/chat-detail";
import { Fragment } from "react";
import { User } from "next-auth";

type ChatScreenProps = {
  user?: User;
};

const ChatScreen = ({ user }: ChatScreenProps) => {
  return (
    <Fragment>
      <MyChatSection userId={user?.id || ""} />
      <ChatDetailSection user={user} />
    </Fragment>
  );
};

export default ChatScreen;
