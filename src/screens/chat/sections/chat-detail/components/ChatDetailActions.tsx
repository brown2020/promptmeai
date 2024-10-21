import { bookmarkChat } from "@/services/chatService";
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
    savedChats,
    setChats,
    setSavedChats,
    setActiveTab,
  } = useChatSideBarStore();

  const saveHandler = useCallback(async () => {
    if (!user?.id || !activeChatId) return;

    const result = await bookmarkChat(user?.id, activeChatId);

    if (result) {
      toast.success("Chat saved successfully.", {
        id: "save-success",
      });

      const { result, notFound } = moveChatById(
        activeChatId,
        chats,
        savedChats
      );

      if (!notFound) {
        setChats(result.newFromArray);
        setSavedChats(result.newToArray);
        setActiveTab("saved");
      }
    } else {
      toast.error("Failed to save the chat.", {
        id: "save-failed",
      });
    }
  }, [
    activeChatId,
    chats,
    savedChats,
    setActiveTab,
    setChats,
    setSavedChats,
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
            case "save":
              return saveHandler();
            case "delete":
              return deleteHandler();
          }
        }}
      >
        <DropdownItem key="save">Save Chat</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete Chat
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ChatDetailActions;
