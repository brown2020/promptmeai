import { auth } from "@/auth";
import ChatScreen from "@/screens/chat";

const ChatPage = async () => {
  const session = await auth();

  return <ChatScreen userId={session?.user?.id || ""} />;
};

export default ChatPage;
