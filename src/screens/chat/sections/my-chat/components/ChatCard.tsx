import { WarningChangingMessage } from "@/components/modals";
import { cn } from "@/utils/tailwind";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { useChatStore } from "@/zustand/useChatStore";
import { Fragment, useState } from "react";

type ChatCardProps = {
  id: string;
  title: string;
};

const ChatCard = ({ id, title }: ChatCardProps) => {
  const { setActiveChatId, activeChatId, setDrawerOpen } = useChatSideBarStore(
    (state) => state
  );
  const { isLoading: anotherActiveRequest } = useChatStore();

  const [showWarning, setShowWarning] = useState<boolean>(false);

  const isActive = activeChatId === id;

  const changeMessageHandler = () => {
    setActiveChatId(id);
    setDrawerOpen(false);
  };

  return (
    <Fragment>
      <div
        className={cn(
          "flex flex-col gap-[6px] py-[11px] px-[18px] rounded-lg w-full cursor-pointer hover:bg-[#23C69E]/[0.20] dark:hover:bg-[#1E1F22]",
          {
            "bg-[#23C69E]/[0.15] dark:bg-[#1E1F22]": isActive,
          }
        )}
        onClick={() => {
          if (anotherActiveRequest) {
            setShowWarning(true);
          } else {
            changeMessageHandler();
          }
        }}
      >
        <div className="flex items-center justify-between gap-[8px]">
          <h4 className="text-[14px] text-[#1E1F22] dark:text-[#EEE]/[0.9] whitespace-nowrap overflow-hidden text-ellipsis">
            {title}
          </h4>
        </div>
      </div>

      {/* Warning for changing message if there is active request */}
      <WarningChangingMessage
        showWarning={showWarning}
        setShowWarning={setShowWarning}
        onFinish={changeMessageHandler}
      />
    </Fragment>
  );
};

export default ChatCard;
