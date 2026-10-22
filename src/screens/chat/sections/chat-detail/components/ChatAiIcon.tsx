import { cn } from "@/utils/tailwind";
import { GiBrainTentacle } from "react-icons/gi";

type ChatAiIconProps = {
  aiModel: string;
};

const iconColor = (aiModel: string): string => {
  const model = aiModel.toLowerCase();
  if (model.includes("gpt")) return "bg-[#14A27F]";
  if (model.includes("gemini")) return "bg-[#FF6F61]";
  if (model.includes("claude")) return "bg-[#F39C12]";
  return "bg-gray-500";
};

const ChatAiIcon = ({ aiModel }: ChatAiIconProps) => {
  return (
    <div className="absolute top-[8px] left-[-16px]">
      <div
        className={cn(
          "rounded-lg w-[32px] h-[32px] flex justify-center items-center shadow-sm",
          iconColor(aiModel)
        )}
      >
        <GiBrainTentacle color="white" size={16} aria-hidden />
      </div>
    </div>
  );
};

export default ChatAiIcon;
