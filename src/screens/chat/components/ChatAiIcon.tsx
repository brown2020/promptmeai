import { cn } from "@/utils/tailwind";
import { GiBrainTentacle } from "react-icons/gi";

type ChatAiIconProps = {
  aiModel: string;
};

const ChatAiIcon = ({ aiModel }: ChatAiIconProps) => {
  return (
    <div className="absolute top-[8px] left-[-16px]">
      <div
        className={cn(
          "rounded-lg w-[32px] h-[32px] flex justify-center items-center shadow",
          {
            "bg-[#14A27F]": aiModel.toLowerCase().includes("gpt"),
            "bg-[#FF6F61]": aiModel.toLowerCase().includes("gemini"),
            "bg-[#3498DB]": aiModel.toLowerCase().includes("mistral"),
            "bg-[#F39C12]": aiModel.toLowerCase().includes("claude"),
            "bg-[#8E44AD]": aiModel.toLowerCase().includes("llama"),
          }
        )}
      >
        <GiBrainTentacle color="white" size={16} />
      </div>
    </div>
  );
};

export default ChatAiIcon;
