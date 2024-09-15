import ButtonIcon from "@/components/v2/ButtonIcon";
import { BsThreeDots } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";

const ChatDetailController = () => {
  return (
    <div className="flex gap-[8px]">
      <ButtonIcon icon={IoSearch} type="secondary" iconSize={16} />
      <ButtonIcon icon={BsThreeDots} type="secondary" iconSize={16} />
    </div>
  );
};

export default ChatDetailController;
