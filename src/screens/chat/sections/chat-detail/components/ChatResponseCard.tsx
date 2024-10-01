import { cn } from "@/utils/tailwind";
import MarkdownRenderer from "@/components/v2/MarkdownRenderer";
import ChatAiIcon from "./ChatAiIcon";
import ChatProfileIcon from "./ChatProfileIcon";
import CreditUsage from "./CreditUsage";

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
      <div className="flex gap-[8px] items-center text-[#1E1F22] ml-[24px]">
        <span className="text-[12px] font-bold ">{aiModel || "You"}</span>
      </div>
      <div
        className={cn(
          "min-h-[40px] w-fit bg-white rounded-lg py-[12px] px-[24px] flex items-center",
          {
            "bg-[#14A27F]/[0.15]": aiModel?.toLowerCase().includes("gpt"),
            "bg-[#FF6F61]/[0.15]": aiModel?.toLowerCase().includes("gemini"),
            "bg-[#3498DB]/[0.15]": aiModel?.toLowerCase().includes("mistral"),
            "bg-[#F39C12]/[0.15]": aiModel?.toLowerCase().includes("claude"),
            "bg-[#8E44AD]/[0.15]": aiModel?.toLowerCase().includes("llama"),
          }
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
