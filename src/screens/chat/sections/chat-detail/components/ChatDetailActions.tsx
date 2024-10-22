import { pinChat, removePinnedChat } from "@/services/chatService";
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
import React, { useMemo } from "react";
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

  const isPinnedChat = useMemo(
    () => pinnedChats.find((p) => p.id === activeChatId),
    [activeChatId, pinnedChats]
  );

  const pinHandler = async () => {
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
  };

  const unpinHandler = async () => {
    if (!user?.id || !activeChatId) return;

    const result = await removePinnedChat(user?.id, activeChatId);

    if (result) {
      toast.success("Chat unpinned successfully.", {
        id: "unpin-success",
      });

      const { result, notFound } = moveChatById(
        activeChatId,
        pinnedChats,
        chats
      );

      if (!notFound) {
        setPinnedChats(result.newFromArray);
        setChats(result.newToArray);
        setActiveTab("chats");
      }
    } else {
      toast.error("Failed to unpin the chat.", {
        id: "unpin-failed",
      });
    }
  };

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
              return isPinnedChat ? unpinHandler() : pinHandler();
            case "delete":
              return deleteHandler();
          }
        }}
      >
        <DropdownItem key="pin">{`${
          isPinnedChat ? "Unpin" : "Pin"
        } Chat`}</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete Chat
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default React.memo(ChatDetailActions);
