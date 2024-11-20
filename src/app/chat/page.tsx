import { auth } from "@/auth";
import ChatScreen from "@/screens/chat";

const ChatPage = async () => {
  const session = await auth();

  return <ChatScreen user={session?.user} />;
};

export default ChatPage;
