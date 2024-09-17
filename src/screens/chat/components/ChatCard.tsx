import { cn } from "@/utils/tailwind";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";

type ChatCardProps = {
  id: string;
  title: string;
};

const ChatCard = ({ id, title }: ChatCardProps) => {
  const { setActiveChatId, activeChatId } = useChatSideBarStore(
    (state) => state
  );

  const isActive = activeChatId === id;

  return (
    <div
      className={cn(
        "flex flex-col gap-[6px] py-[11px] px-[18px] rounded-lg w-full cursor-pointer hover:bg-[#23C69E]/[0.20]",
        {
          "bg-[#23C69E]/[0.15]": isActive,
        }
      )}
      onClick={() => setActiveChatId(id)}
    >
      <div className="flex items-center justify-between gap-[8px] ">
        <h4 className="text-[14px] font-semibold text-[#1E1F22]">{title}</h4>
      </div>
    </div>
  );
};

export default ChatCard;
