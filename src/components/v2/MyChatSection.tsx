import { BsThreeDots } from "react-icons/bs";
import { HiOutlinePlus } from "react-icons/hi";
import ButtonIcon from "./ButtonIcon";
import ChatTabs from "./ChatTabs";
import SearchInput from "./SearchInput";
import ChatList from "./ChatList";

const MyChatSection = () => {
  return (
    <div className="w-[320px] bg-white p-[15px] flex flex-col gap-[16px]">
      {/* Top section */}
      <div className="flex justify-between items-center gap-[10px]">
        <h2 className="text-[20px] font-bold">My Chats</h2>
        <div className="flex gap-[10px]">
          <ButtonIcon icon={HiOutlinePlus} type="primary" />
          <ButtonIcon icon={BsThreeDots} type="secondary" />
        </div>
      </div>

      {/* Tab section */}
      <ChatTabs />
      {/* Search section */}
      <SearchInput />
      {/* Chat list section */}
      <ChatList />
    </div>
  );
};

export default MyChatSection;
