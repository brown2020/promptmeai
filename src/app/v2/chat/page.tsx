import { BiLogoReact } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { LuSun } from "react-icons/lu";
import { MdNightlightRound } from "react-icons/md";
import { PiChatsCircle } from "react-icons/pi";
import { RiListSettingsFill, RiLogoutBoxRLine } from "react-icons/ri";

const ChatPage = () => {
  return (
    <div className="flex h-screen w-screen">
      {/* Left panel */}
      <div className="flex flex-col justify-between items-center w-[64px] flex-shrink-0 bg-white border-r border-[#EAEAEA] p-[16px]">
        {/* Top section */}
        <div className="flex flex-col gap-[64px] justify-center items-center">
          <div className="w-[32px] h-[32px] bg-[#909090] flex justify-center items-center rounded-lg">
            <BiLogoReact className="text-white" size={26} />
          </div>
          <div className="flex flex-col gap-[24px] justify-center items-center">
            <div className="bg-[#10A37F] rounded-lg w-[32px] h-[32px] flex justify-center items-center shadow-xl">
              <PiChatsCircle size={18} className="text-white" />
            </div>
            <div className="bg-[#F9F9F9] rounded-lg w-[32px] h-[32px] flex justify-center items-center shadow-xl">
              <RiListSettingsFill className="text-[#255148]" size={18} />
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col gap-[25px] justify-center items-center">
          <div className="bg-[#F9F9F9] rounded-lg w-[32px] h-[32px] flex justify-center items-center shadow-xl">
            <CgProfile className="text-[#255148]" size={16} />
          </div>
          <div className="bg-[#F9F9F9] rounded-lg w-[32px] h-[32px] flex justify-center items-center shadow-xl">
            <RiLogoutBoxRLine className="text-[#255148]" size={16} />
          </div>

          <div className="h-[1px] w-full bg-[#EFEFEF]" />
          <div className="h-[60px] w-[32px] bg-[#E2E2E2] rounded-xl flex flex-col justify-center items-center gap-[5px]">
            <button className="w-[20px] h-[20px] flex justify-center items-center">
              <MdNightlightRound size={12} />
            </button>
            <button className="w-[20px] h-[20px] flex justify-center items-center bg-[#FFF] rounded-lg drop-shadow">
              <LuSun size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* My chat section */}
      <div className="w-[320px] bg-white p-[15px] flex flex-col gap-[16px]">
        {/* Top section */}
        <div className="flex justify-between gap-[10px]">
          <h2>My Chats</h2>
          <div className="flex gap-[10px]">
            <div>Plus Icon</div>
            <div>Options Icon</div>
          </div>
        </div>
        {/* Tab section */}
        <div className="bg-[#EEE] rounded-xl border-[0.6px] border-[#E2E2E2] h-[48px] flex gap-[10px] flex-shrink-0 p-[4px]">
          <button className="bg-white text-[#14B48D] rounded-lg w-[140px] flex gap-[6px] h-full items-center justify-center shadow-lg">
            <div>icon</div>
            <span className="uppercase text-[10px] font-semibold">Chats</span>
            <span className="rounded bg-[#14B48D]/[0.15] px-[4px] py-[2px] text-[10px] font-semibold">
              24
            </span>
          </button>
          <button className="w-[140px] text-[#3B3B3B] flex gap-[6px] h-full items-center justify-center">
            <div>icon</div>
            <div className="uppercase text-[10px] font-semibold">Saved</div>
            <div className="rounded bg-[#3B3B3B]/[0.11] px-[4px] py-[2px] text-[10px] font-semibold">
              10
            </div>
          </button>
        </div>
        {/* Search section */}
        <div></div>
      </div>
    </div>
  );
};

export default ChatPage;
