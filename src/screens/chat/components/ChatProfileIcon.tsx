import { CgProfile } from "react-icons/cg";

const ChatProfileIcon = () => {
  return (
    <div className="absolute top-[8px] left-[-16px]">
      <div className="bg-[#F9F9F9] rounded-lg w-[32px] h-[32px] flex justify-center items-center shadow">
        <CgProfile className="text-[#255148]" size={16} />
      </div>
    </div>
  );
};

export default ChatProfileIcon;
