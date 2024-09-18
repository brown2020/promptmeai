import ButtonIcon from "@/components/v2/ButtonIcon";
import { BsThreeDots } from "react-icons/bs";

const ChatDetailController = () => {
  return (
    <div className="flex gap-[8px]">
      <ButtonIcon icon={BsThreeDots} type="secondary" iconSize={16} />
    </div>
  );
};

export default ChatDetailController;
