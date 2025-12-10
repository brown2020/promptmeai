import { cn } from "@/utils/tailwind";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ChatAiIcon from "./ChatAiIcon";
import ChatProfileIcon from "./ChatProfileIcon";
import CreditUsage from "./CreditUsage";
import { getModelColorByLabel } from "@/constants/modelColors";

type ChatResponseCardProps = {
  type: "self" | "ai";
  aiModel?: string;
  content: string;
  tokenUsage?: number;
};

const ChatResponseCard = ({
  type,
  aiModel,
  content,
  tokenUsage,
}: ChatResponseCardProps) => {
  const modelColor = aiModel ? getModelColorByLabel(aiModel) : "";

  return (
    <div
      className={cn("relative flex flex-col gap-[4px] ml-[16px]", {
        "self-end": type === "self",
      })}
    >
      {type === "ai" && aiModel ? (
        <ChatAiIcon aiModel={aiModel} />
      ) : (
        <ChatProfileIcon />
      )}
      <div className="flex gap-[8px] items-center text-[#1E1F22] dark:text-[#EEE] ml-[24px]">
        <span className="text-[12px] font-bold ">{aiModel || "You"}</span>
      </div>
      <div
        className={cn(
          "min-h-[40px] w-fit bg-white dark:bg-[#4B4F5B] rounded-lg py-[12px] px-[24px] flex items-center",
          {
            "dark:bg-[#27303F]": aiModel,
          },
          modelColor
        )}
      >
        <div className="relative text-[14px] text-[#1E1F22]">
          {tokenUsage && <CreditUsage tokenUsage={tokenUsage} />}
          <MarkdownRenderer content={content} />
        </div>
      </div>
    </div>
  );
};

export default ChatResponseCard;
