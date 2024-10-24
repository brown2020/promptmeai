import { deleteChat, pinChat, removePinnedChat } from "@/services/chatService";
import { deleteChatById, moveChatById } from "@/utils/chat";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { useChatStore } from "@/zustand/useChatStore";
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
    activeTab,
    setChats,
    setPinnedChats,
    setActiveTab,
    setActiveChatId,
  } = useChatSideBarStore();
  const { setMessages, isLoading } = useChatStore();

  const isPinnedChat = useMemo(
    () => pinnedChats.find((p) => p.id === activeChatId),
    [activeChatId, pinnedChats]
  );
  const disabledAllKeys = useMemo(() => {
    if (!activeChatId || isLoading) {
      return ["pin", "delete"];
    } else {
      return [];
    }
  }, [activeChatId, isLoading]);

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

  const deleteHandler = async () => {
    if (!user?.id || !activeChatId) return;

    const result = await deleteChat(user?.id, activeChatId);

    if (result) {
      const chatData = activeTab === "chats" ? chats : pinnedChats;
      const newData = deleteChatById(activeChatId, chatData);

      if (activeTab === "chats") {
        setChats(newData);
      } else if (activeTab === "pinned") {
        setPinnedChats(newData);
      }

      setActiveChatId(undefined);
      setMessages([]);

      toast.success("Chat deleted successfully.", { id: "delete-success" });
    } else {
      toast.error("Failed to delete the chat.", {
        id: "delete-failed",
      });
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly className="bg-[#F9F9F9] dark:bg-[#1E1F21] shadow-xl">
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
        disabledKeys={disabledAllKeys}
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
