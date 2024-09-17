import { IoSearch } from "react-icons/io5";

const SearchInput = () => {
  return (
    <div className="flex gap-[10px]">
      <div className="flex gap-[8px] items-center bg-[#D6D6D6]/[0.30] rounded-lg h-[40px] w-full p-[10px] shadow">
        <IoSearch size={18} color="#575B65" />
        <input
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-[14px] text-[#575B65] w-full"
        />
      </div>
    </div>
  );
};

export default SearchInput;
