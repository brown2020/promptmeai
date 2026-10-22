import { auth } from "@/firebase/firebaseClient";
import { deleteChat, pinChat, removePinnedChat } from "@/services/chatService";
import { deleteChatById, moveChatById } from "@/utils/chat";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { useChatStore } from "@/zustand/useChatStore";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BsThreeDots } from "react-icons/bs";

const ChatDetailActions = () => {
  const user = auth.currentUser;
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
  const [confirmDelete, setConfirmDelete] = useState(false);

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
    if (!user?.uid || !activeChatId) return;

    const pinResult = await pinChat(user?.uid, activeChatId);

    if (pinResult) {
      toast.success("Chat pinned successfully.", {
        id: "pin-success",
      });

      const { result: moveResult, notFound } = moveChatById(
        activeChatId,
        chats,
        pinnedChats
      );

      if (!notFound) {
        setChats(moveResult.newFromArray);
        setPinnedChats(moveResult.newToArray);
        setActiveTab("pinned");
      }
    } else {
      toast.error("Failed to pin the chat.", {
        id: "pin-failed",
      });
    }
  };

  const unpinHandler = async () => {
    if (!user?.uid || !activeChatId) return;

    const unpinResult = await removePinnedChat(user?.uid, activeChatId);

    if (unpinResult) {
      toast.success("Chat unpinned successfully.", {
        id: "unpin-success",
      });

      const { result: moveResult, notFound } = moveChatById(
        activeChatId,
        pinnedChats,
        chats
      );

      if (!notFound) {
        setPinnedChats(moveResult.newFromArray);
        setChats(moveResult.newToArray);
        setActiveTab("chats");
      }
    } else {
      toast.error("Failed to unpin the chat.", {
        id: "unpin-failed",
      });
    }
  };

  const deleteHandler = async () => {
    if (!user?.uid || !activeChatId) return;

    const result = await deleteChat(user?.uid, activeChatId);

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
    <>
    <Dropdown>
      <DropdownTrigger>
        <Button
          isIconOnly
          aria-label="Chat actions"
          className="bg-[#F9F9F9] dark:bg-[#1E1F21] shadow-xl"
        >
          <BsThreeDots aria-hidden />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Chat Action"
        onAction={(key) => {
          switch (key) {
            case "pin":
              return isPinnedChat ? unpinHandler() : pinHandler();
            case "delete":
              setConfirmDelete(true);
              return;
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
    <DeleteChatDialog
      open={confirmDelete}
      onCancel={() => setConfirmDelete(false)}
      onConfirm={() => {
        setConfirmDelete(false);
        void deleteHandler();
      }}
    />
    </>
  );
};

function DeleteChatDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="delete-chat-title"
      className="w-[min(100%,24rem)] rounded-md border-0 bg-white p-6 text-[#1E1F22] shadow-lg overscroll-contain backdrop:bg-black/50 dark:bg-[#272A2E] dark:text-[#EEE]"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      <h2 id="delete-chat-title" className="text-lg">
        Delete this chat?
      </h2>
      <p className="mb-4 mt-2 text-sm">This removes the conversation from your account.</p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="rounded-md bg-gray-500 px-3 py-2 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A8F70]"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-md bg-red-600 px-3 py-2 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A8F70]"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </dialog>
  );
}

export default React.memo(ChatDetailActions);
