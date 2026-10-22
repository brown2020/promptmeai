import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";

const SearchInput = () => {
  const searchTerm = useChatSideBarStore((state) => state.searchTerm);
  const setSearchTerm = useChatSideBarStore((state) => state.setSearchTerm);
  const [localTerm, setLocalTerm] = useState(searchTerm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalTerm(value);
    setSearchTerm(value);
  };

  return (
    <div className="flex gap-2.5">
      <div className="flex h-11 w-full items-center gap-2 rounded-lg bg-gray-300/30 p-2.5 shadow-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#1A8F70] dark:bg-gray-700">
        <IoSearch size={18} aria-hidden className="text-gray-600 dark:text-gray-400" />
        <label htmlFor="chat-search" className="sr-only">
          Search chats
        </label>
        <input
          id="chat-search"
          name="search"
          placeholder="Search…"
          aria-label="Search chats"
          className="w-full border-none bg-transparent text-base text-gray-600 outline-none dark:text-gray-400"
          value={localTerm}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default SearchInput;
