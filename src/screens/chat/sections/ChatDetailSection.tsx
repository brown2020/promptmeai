import ChatDetailController from "../components/ChatDetailController";
import ChatInput from "../components/ChatInput";
import ChatResponseList from "../components/ChatResponseList";

type ChatDetailSectionProps = {
  title: string;
};

const ChatDetailSection = ({ title }: ChatDetailSectionProps) => {
  return (
    <div className="w-full h-full p-[16px] flex flex-col gap-[16px]">
      {/* Top section */}
      <div className="flex justify-between items-center">
        <h3 className="text-[20px] font-bold text-[#1E1F22]">{title}</h3>
        <ChatDetailController />
      </div>
      {/* Main chat detail section */}
      <div className="bg-[#F5F5F5] h-[calc(100%-48px)] w-[calc(100% + 32px)] rounded-lg ml-[-16px] flex justify-center px-[24px]">
        {/* Wrapper */}
        <div className="h-full w-full max-w-[736px] flex flex-col gap-[24px] justify-between items-center py-[24px] ">
          <ChatResponseList />
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default ChatDetailSection;
