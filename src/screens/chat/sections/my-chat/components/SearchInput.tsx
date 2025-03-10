import { ChatDetail } from "@/types/chat";
import { searchChatByName } from "@/utils/chat";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";

const SearchInput = () => {
  const { chats, setChats } = useChatSideBarStore((state) => state);
  const [allChat, setAllChat] = useState<ChatDetail[]>([]);
  const [isInitial, setIsInitial] = useState<boolean>(false);

  useEffect(() => {
    if (chats.length > 0 && !isInitial) {
      setAllChat(chats);
      setIsInitial(true);
    }
  }, [chats, isInitial]);

  const searchHandler = (searchTerm: string) => {
    const searchResult = searchChatByName(allChat, searchTerm);

    setChats(searchResult);
  };

  return (
    <div className="flex gap-[10px]">
      <div className="flex gap-[8px] items-center bg-[#D6D6D6]/[0.30] dark:bg-[#3F424A] rounded-lg h-[40px] w-full p-[10px] shadow-sm">
        <IoSearch size={18} className="text-[#575B65] dark:text-[#9CA3AF]" />
        <input
          placeholder="Search..."
          className="bg-transparent border-none outline-hidden text-[16px] text-[#575B65] dark:text-[#9CA3AF] w-full"
          onChange={(e) => searchHandler(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchInput;
