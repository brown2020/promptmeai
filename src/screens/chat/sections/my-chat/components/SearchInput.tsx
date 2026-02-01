import { ChatDetail } from "@/types/chat";
import { searchChatByName } from "@/utils/chat";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";

const SearchInput = () => {
  const { chats, setChats } = useChatSideBarStore((state) => state);
  const [searchTerm, setSearchTerm] = useState("");

  // Store the original chat list in a ref to avoid stale closure issues
  const originalChatsRef = useRef<ChatDetail[]>([]);

  // Update the ref when chats change and search is empty
  useEffect(() => {
    if (searchTerm === "" && chats.length > 0) {
      originalChatsRef.current = chats;
    }
  }, [chats, searchTerm]);

  // Debounced search to prevent excessive filtering on every keystroke
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term === "") {
        setChats(originalChatsRef.current);
      } else {
        const searchResult = searchChatByName(originalChatsRef.current, term);
        setChats(searchResult);
      }
    }, 300),
    [setChats]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="flex gap-2.5">
      <div className="flex gap-2 items-center bg-gray-300/30 dark:bg-gray-700 rounded-lg h-10 w-full p-2.5 shadow-sm">
        <IoSearch size={18} className="text-gray-600 dark:text-gray-400" />
        <input
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-base text-gray-600 dark:text-gray-400 w-full"
          value={searchTerm}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default SearchInput;
