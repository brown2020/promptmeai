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
      <div className="flex gap-2 items-center bg-gray-300/30 dark:bg-gray-700 rounded-lg h-10 w-full p-2.5 shadow-sm">
        <IoSearch size={18} className="text-gray-600 dark:text-gray-400" />
        <input
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-base text-gray-600 dark:text-gray-400 w-full"
          value={localTerm}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default SearchInput;
