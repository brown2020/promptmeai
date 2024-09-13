import { BiLogoReact } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { HiOutlinePlus } from "react-icons/hi";
import { IoBookmark, IoSearch } from "react-icons/io5";
import { LuListFilter, LuSun } from "react-icons/lu";
import { MdNightlightRound } from "react-icons/md";
import { PiChatsCircle, PiChatsCircleFill } from "react-icons/pi";
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
        <div className="flex justify-between items-center gap-[10px]">
          <h2 className="text-[20px] font-bold">My Chats</h2>
          <div className="flex gap-[10px]">
            <div className="w-[32px] h-[32px] flex-shrink-0 flex items-center justify-center bg-[#23C69E] rounded-lg cursor-pointer">
              <HiOutlinePlus size={18} color="white" />
            </div>
            <div className="w-[32px] h-[32px] flex-shrink-0 flex items-center justify-center bg-[#EFEFEF] rounded-lg cursor-pointer">
              <BsThreeDots size={18} color="#3B3B3B" />
            </div>
          </div>
        </div>
        {/* Tab section */}
        <div className="bg-[#EEE] rounded-xl border-[0.6px] border-[#E2E2E2] h-[48px] flex gap-[10px] flex-shrink-0 p-[4px]">
          <button className="bg-white text-[#14B48D] rounded-lg w-[140px] flex gap-[6px] h-full items-center justify-center shadow-lg">
            <PiChatsCircleFill size={14} color="#14B48D" />
            <span className="uppercase text-[12px] font-semibold">Chats</span>
            <span className="rounded bg-[#14B48D]/[0.15] px-[4px] py-[2px] text-[10px] font-semibold">
              24
            </span>
          </button>
          <button className="w-[140px] text-[#3B3B3B] flex gap-[6px] h-full items-center justify-center">
            <IoBookmark size={14} color="#3B3B3B" />
            <div className="uppercase text-[12px] font-semibold">Saved</div>
            <div className="rounded bg-[#3B3B3B]/[0.11] px-[4px] py-[2px] text-[10px] font-semibold">
              10
            </div>
          </button>
        </div>
        {/* Search section */}
        <div className="flex gap-[10px]">
          {/* Input search */}
          <div className="flex gap-[8px] items-center bg-[#D6D6D6]/[0.10] rounded-lg h-[40px] w-full p-[10px] shadow">
            <IoSearch size={18} color="#575B65" />
            <input
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-[14px] text-[#575B65] w-full"
            />
          </div>
          {/* filter button */}
          <div className="flex flex-shrink-0 justify-center items-center bg-[#EFEFEF] h-[40px] w-[40px] rounded shadow cursor-pointer">
            <LuListFilter size={20} color="#14B48D" />
          </div>
        </div>
        {/* Chat list section */}
        <div className="flex flex-col flex-shrink-0 gap-[8px]">
          {/* Chat active */}
          <div className="flex flex-col gap-[6px] bg-[#E3FEF7] py-[11px] px-[18px] rounded-lg w-full cursor-pointer">
            <div className="flex items-center justify-between gap-[8px] ">
              <h4 className="text-[14px] font-semibold text-[#1E1F22]">
                Warning Messages Samples
              </h4>
              <span className="text-[10px] text-[#9F9F9F]">Now</span>
            </div>
            <div className="text-[12px] text-[#6D717C] h-42">
              Some 15 billion years ago the universe emerged from a hot, dense
              sea of...
            </div>
          </div>
          {/* Normal chat */}
          <div className="flex flex-col gap-[6px] py-[11px] px-[18px] rounded-lg w-full cursor-pointer">
            <div className="flex items-center justify-between gap-[8px] ">
              <h4 className="text-[14px] font-semibold text-[#1E1F22]">
                Competitive Analysis research
              </h4>
              <span className="text-[10px] text-[#9F9F9F]">Thu</span>
            </div>
            <div className="text-[12px] text-[#6D717C] h-42">
              A competitive analysis of restaurant delivery mobile applications
              reveals key insights ...
            </div>
          </div>
        </div>
      </div>

      {/* Chat detail section */}
      <div className="w-full h-full p-[16px] flex flex-col gap-[16px]">
        {/* Top section */}
        <div className="flex justify-between items-center">
          <h3 className="text-[20px] font-bold text-[#1E1F22]">
            Warning Messages Samples
          </h3>
          <div className="flex gap-[8px]">
            <div className="h-[32px] w-[32px] rounded-lg cursor-pointer bg-[#EFEFEF] flex justify-center items-center">
              <IoSearch size={16} color="#1E1F22" />
            </div>
            <div className="h-[32px] w-[32px] rounded-lg cursor-pointer bg-[#EFEFEF] flex justify-center items-center">
              <BsThreeDots size={16} color="#1E1F22" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
