import { cn } from "@/utils/tailwind";

type ChatCardProps = {
  title: string;
  description: string;
  time: string;
  isActive?: boolean;
};

const ChatCard = ({ title, description, time, isActive }: ChatCardProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-[6px] py-[11px] px-[18px] rounded-lg w-full cursor-pointer hover:bg-[#23C69E]/[0.20]",
        {
          "bg-[#23C69E]/[0.15]": isActive,
        }
      )}
    >
      <div className="flex items-center justify-between gap-[8px] ">
        <h4 className="text-[14px] font-semibold text-[#1E1F22]">{title}</h4>
        <span className="text-[10px] text-[#9F9F9F]">{time}</span>
      </div>
      <div className="text-[12px] text-[#6D717C] h-42">{description}</div>
    </div>
  );
};

export default ChatCard;
