import { AiModels } from "@/types/ai";
import { cn } from "@/utils/tailwind";
import { GiBrainTentacle } from "react-icons/gi";

type ChatAiIconProps = {
  aiModel: AiModels;
};

const ChatAiIcon = ({ aiModel }: ChatAiIconProps) => {
  return (
    <div className="absolute top-[8px] left-[-16px]">
      <div
        className={cn(
          "rounded-lg w-[32px] h-[32px] flex justify-center items-center shadow",
          {
            "bg-[#14A27F]": aiModel === "gpt",
            "bg-[#FF6F61]": aiModel === "gemini",
            "bg-[#3498DB]": aiModel === "mistral",
            "bg-[#F39C12]": aiModel === "claude",
            "bg-[#8E44AD]": aiModel === "llama",
          }
        )}
      >
        <GiBrainTentacle color="white" size={16} />
      </div>
    </div>
  );
};

export default ChatAiIcon;
