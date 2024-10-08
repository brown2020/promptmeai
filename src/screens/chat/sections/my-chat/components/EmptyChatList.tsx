import React from "react";
import { PiChatsCircleBold } from "react-icons/pi";

type EmptyChatListProps = {
  message?: string;
};

const EmptyChatList: React.FC<EmptyChatListProps> = ({
  message = "No messages yet. Start a conversation!",
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100%-200px)] text-gray-500 p-4">
      <PiChatsCircleBold className="text-6xl mb-4" />
      <p className="text-lg text-center">{message}</p>
    </div>
  );
};

export default EmptyChatList;
