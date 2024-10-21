import { pinChat } from "@/services/chatService";
import { moveChatById } from "@/utils/chat";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { useUser } from "@clerk/nextjs";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { BsThreeDots } from "react-icons/bs";

const ChatDetailActions = () => {
  const { user } = useUser();
  const {
    activeChatId,
    chats,
    pinnedChats,
    setChats,
    setPinnedChats,
    setActiveTab,
  } = useChatSideBarStore();

  const pinHandler = useCallback(async () => {
    if (!user?.id || !activeChatId) return;

    const result = await pinChat(user?.id, activeChatId);

    if (result) {
      toast.success("Chat pinned successfully.", {
        id: "pin-success",
      });

      const { result, notFound } = moveChatById(
        activeChatId,
        chats,
        pinnedChats
      );

      if (!notFound) {
        setChats(result.newFromArray);
        setPinnedChats(result.newToArray);
        setActiveTab("pinned");
      }
    } else {
      toast.error("Failed to pin the chat.", {
        id: "pin-failed",
      });
    }
  }, [
    activeChatId,
    chats,
    pinnedChats,
    setActiveTab,
    setChats,
    setPinnedChats,
    user?.id,
  ]);

  const deleteHandler = () => {
    alert("delete");
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant="light" className="bg-[#F9F9F9] shadow-xl">
          <BsThreeDots />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Chat Action"
        onAction={(key) => {
          switch (key) {
            case "pin":
              return pinHandler();
            case "delete":
              return deleteHandler();
          }
        }}
      >
        <DropdownItem key="pin">Pin Chat</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete Chat
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ChatDetailActions;
