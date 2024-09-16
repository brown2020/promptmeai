import { ImMagicWand } from "react-icons/im";
import { IoMicOutline } from "react-icons/io5";
import { PiPaperPlaneTilt } from "react-icons/pi";

const ChatInput = () => {
  return (
    <div className="self-end w-full max-w-[720px] h-[56px] flex-shrink-0 flex gap-[16px] justify-center items-center">
      <div className="w-full bg-white rounded-xl shadow p-[12px] flex gap-[12px] items-center">
        <div className="flex items-center justify-center h-[32px] w-[32px] bg-[#E7E9F0] rounded-lg cursor-pointer flex-shrink-0">
          <ImMagicWand size={14} />
        </div>
        <input
          className="w-full text-[14px] text-[#A0A7BB] outline-none"
          placeholder="Ask questions, or type '/' for commands"
        />
        <div className="flex items-center justify-center h-[32px] w-[32px] rounded-lg cursor-pointer flex-shrink-0">
          <PiPaperPlaneTilt size={18} color="#ABABAB" />
        </div>
      </div>
      <div className="cursor-pointer w-[56px] h-[56px] flex-shrink-0 bg-white rounded-xl flex justify-center items-center shadow">
        <IoMicOutline size={24} color="#ABABAB" />
      </div>
    </div>
  );
};

export default ChatInput;
