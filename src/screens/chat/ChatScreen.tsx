import LeftPanel from "@/components/v2/LeftPanel";
import { BsThreeDots } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { GiBrainTentacle } from "react-icons/gi";
import { HiOutlinePlus } from "react-icons/hi";
import { ImMagicWand } from "react-icons/im";
import { IoBookmark, IoMicOutline, IoSearch } from "react-icons/io5";
import { LuListFilter } from "react-icons/lu";
import { PiChatsCircleFill, PiPaperPlaneTilt } from "react-icons/pi";

const ChatScreen = () => {
  return (
    <div className="flex h-screen w-screen">
      <LeftPanel />

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
        {/* main chat detail section */}
        <div className="bg-[#F5F5F5] h-[calc(100%-48px)] w-[calc(100% + 32px)] rounded-lg ml-[-16px] flex justify-center px-[24px]">
          {/* wrapper */}
          <div className="h-full w-full max-w-[736px] flex flex-col gap-[24px] justify-between items-center py-[24px] ">
            {/* Chat detail section */}
            <div className="h-full w-full overflow-y-auto flex flex-col gap-[24px] pr-[8px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
              {/* Self chat card*/}
              <div className="relative flex flex-col gap-[4px] ml-[16px] self-end">
                {/* ProfileIcon */}
                <div className="absolute top-[8px] left-[-16px]">
                  <div className="bg-[#F9F9F9] rounded-lg w-[32px] h-[32px] flex justify-center items-center shadow">
                    <CgProfile className="text-[#255148]" size={16} />
                  </div>
                </div>
                <div className="flex gap-[8px] items-center text-[#1E1F22] ml-[24px]">
                  <span className="text-[12px] font-bold ">You</span>
                  <span className="text-[10px]">24 Sep - 11:30 PM</span>
                </div>
                <div className="min-h-[40px] w-fit bg-white rounded-lg py-[12px] px-[24px] flex items-center">
                  <div className="text-[14px] text-[#1E1F22]">
                    How do you define usability testing in UX design?
                  </div>
                </div>
              </div>

              {/* Open AI response */}
              <div className="relative flex flex-col gap-[4px] ml-[16px]">
                {/* AiIcon */}
                <div className="absolute top-[8px] left-[-16px]">
                  <div className="bg-[#14A27F] rounded-lg w-[32px] h-[32px] flex justify-center items-center shadow">
                    <GiBrainTentacle color="white" size={16} />
                  </div>
                </div>
                <div className="flex gap-[8px] items-center text-[#1E1F22] ml-[24px]">
                  <span className="text-[12px] font-bold ">GPT-4 Omni</span>
                  <span className="text-[10px]">24 Sep - 11:30 PM</span>
                </div>
                <div className="min-h-[40px] w-fit bg-[#14A27F]/[0.15] rounded-lg py-[12px] px-[24px] flex items-center">
                  <div className="text-[14px] text-[#1E1F22]">
                    Sure! Here are three different versions of 404 error
                    messages for an ecommerce clothing website: Uh-oh! It looks
                    like the page you're looking for isn't here. Please check
                    the URL and try again or return to the homepage to continue
                    shopping. 2. Whoops! We can't seem to find the page you're
                    looking for. Please double-check the URL or use our search
                    bar to find what you need. You can also browse our
                    collection of stylish clothes and accessories. 3. Sorry, the
                    page you're trying to access isn't available. It's possible
                    that the item has sold out or the page has been removed.
                    Please click back to return to the previous page or head
                    over to our homepage to explore more.
                  </div>
                </div>
              </div>

              {/* Gemini AI response */}
              <div className="relative flex flex-col gap-[4px] ml-[16px]">
                {/* AiIcon */}
                <div className="absolute top-[8px] left-[-16px]">
                  <div className="bg-[#FF6F61] rounded-lg w-[32px] h-[32px] flex justify-center items-center shadow">
                    <GiBrainTentacle color="white" size={16} />
                  </div>
                </div>
                <div className="flex gap-[8px] items-center text-[#1E1F22] ml-[24px]">
                  <span className="text-[12px] font-bold ">Gemini 1.5 Pro</span>
                  <span className="text-[10px]">24 Sep - 11:30 PM</span>
                </div>
                <div className="min-h-[40px] w-fit bg-[#FF6F61]/[0.15] rounded-lg py-[12px] px-[24px] flex items-center">
                  <div className="text-[14px] text-[#1E1F22]">
                    Sure! Here are three different versions of 404 error
                    messages for an ecommerce clothing website: Uh-oh! It looks
                    like the page you're looking for isn't here. Please check
                    the URL and try again or return to the homepage to continue
                    shopping. 2. Whoops! We can't seem to find the page you're
                    looking for. Please double-check the URL or use our search
                    bar to find what you need. You can also browse our
                    collection of stylish clothes and accessories. 3. Sorry, the
                    page you're trying to access isn't available. It's possible
                    that the item has sold out or the page has been removed.
                    Please click back to return to the previous page or head
                    over to our homepage to explore more.
                  </div>
                </div>
              </div>

              {/* Mistral AI response */}
              <div className="relative flex flex-col gap-[4px] ml-[16px]">
                {/* AiIcon */}
                <div className="absolute top-[8px] left-[-16px]">
                  <div className="bg-[#3498DB] rounded-lg w-[32px] h-[32px] flex justify-center items-center shadow">
                    <GiBrainTentacle color="white" size={16} />
                  </div>
                </div>
                <div className="flex gap-[8px] items-center text-[#1E1F22] ml-[24px]">
                  <span className="text-[12px] font-bold ">Mistral Large</span>
                  <span className="text-[10px]">24 Sep - 11:30 PM</span>
                </div>
                <div className="min-h-[40px] w-fit bg-[#3498DB]/[0.15] rounded-lg py-[12px] px-[24px] flex items-center">
                  <div className="text-[14px] text-[#1E1F22]">
                    Sure! Here are three different versions of 404 error
                    messages for an ecommerce clothing website: Uh-oh! It looks
                    like the page you're looking for isn't here. Please check
                    the URL and try again or return to the homepage to continue
                    shopping. 2. Whoops! We can't seem to find the page you're
                    looking for. Please double-check the URL or use our search
                    bar to find what you need. You can also browse our
                    collection of stylish clothes and accessories. 3. Sorry, the
                    page you're trying to access isn't available. It's possible
                    that the item has sold out or the page has been removed.
                    Please click back to return to the previous page or head
                    over to our homepage to explore more.
                  </div>
                </div>
              </div>

              {/* Claude AI response */}
              <div className="relative flex flex-col gap-[4px] ml-[16px]">
                {/* AiIcon */}
                <div className="absolute top-[8px] left-[-16px]">
                  <div className="bg-[#F39C12] rounded-lg w-[32px] h-[32px] flex justify-center items-center shadow">
                    <GiBrainTentacle color="white" size={16} />
                  </div>
                </div>
                <div className="flex gap-[8px] items-center text-[#1E1F22] ml-[24px]">
                  <span className="text-[12px] font-bold ">
                    Claude 3.5 Sonnet
                  </span>
                  <span className="text-[10px]">24 Sep - 11:30 PM</span>
                </div>
                <div className="min-h-[40px] w-fit bg-[#F39C12]/[0.15] rounded-lg py-[12px] px-[24px] flex items-center">
                  <div className="text-[14px] text-[#1E1F22]">
                    Sure! Here are three different versions of 404 error
                    messages for an ecommerce clothing website: Uh-oh! It looks
                    like the page you're looking for isn't here. Please check
                    the URL and try again or return to the homepage to continue
                    shopping. 2. Whoops! We can't seem to find the page you're
                    looking for. Please double-check the URL or use our search
                    bar to find what you need. You can also browse our
                    collection of stylish clothes and accessories. 3. Sorry, the
                    page you're trying to access isn't available. It's possible
                    that the item has sold out or the page has been removed.
                    Please click back to return to the previous page or head
                    over to our homepage to explore more.
                  </div>
                </div>
              </div>

              {/* LLaMA 3.1 405B AI response */}
              <div className="relative flex flex-col gap-[4px] ml-[16px]">
                {/* AiIcon */}
                <div className="absolute top-[8px] left-[-16px]">
                  <div className="bg-[#8E44AD] rounded-lg w-[32px] h-[32px] flex justify-center items-center shadow">
                    <GiBrainTentacle color="white" size={16} />
                  </div>
                </div>
                <div className="flex gap-[8px] items-center text-[#1E1F22] ml-[24px]">
                  <span className="text-[12px] font-bold ">LLaMA 3.1 405B</span>
                  <span className="text-[10px]">24 Sep - 11:30 PM</span>
                </div>
                <div className="min-h-[40px] w-fit bg-[#8E44AD]/[0.15] rounded-lg py-[12px] px-[24px] flex items-center">
                  <div className="text-[14px] text-[#1E1F22]">
                    Sure! Here are three different versions of 404 error
                    messages for an ecommerce clothing website: Uh-oh! It looks
                    like the page you're looking for isn't here. Please check
                    the URL and try again or return to the homepage to continue
                    shopping. 2. Whoops! We can't seem to find the page you're
                    looking for. Please double-check the URL or use our search
                    bar to find what you need. You can also browse our
                    collection of stylish clothes and accessories. 3. Sorry, the
                    page you're trying to access isn't available. It's possible
                    that the item has sold out or the page has been removed.
                    Please click back to return to the previous page or head
                    over to our homepage to explore more.
                  </div>
                </div>
              </div>
            </div>
            {/* Chat input section */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
