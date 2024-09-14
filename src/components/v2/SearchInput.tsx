import { IoSearch } from "react-icons/io5";
import { LuListFilter } from "react-icons/lu";
import ButtonIcon from "./ButtonIcon";

const SearchInput = () => {
  return (
    <div className="flex gap-[10px]">
      <div className="flex gap-[8px] items-center bg-[#D6D6D6]/[0.10] rounded-lg h-[40px] w-full p-[10px] shadow-xl">
        <IoSearch size={18} color="#575B65" />
        <input
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-[14px] text-[#575B65] w-full"
        />
      </div>
      <ButtonIcon
        icon={LuListFilter}
        iconSize={20}
        className="flex-shrink-0 h-[40px] w-[40px]"
      />
    </div>
  );
};

export default SearchInput;
