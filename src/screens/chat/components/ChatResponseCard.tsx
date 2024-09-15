import { AiModels } from "@/types/ai";
import ChatProfileIcon from "./ChatProfileIcon";
import ChatAiIcon from "./ChatAiIcon";

type ChatResponseCardProps = {
  type: "self" | "ai";
  aiModel?: AiModels;
  date: string;
  response: string;
};

const getAiModelName = (aiModel: AiModels) => {
  switch (aiModel) {
    case "gpt":
      return "GPT-4 Omni";
    case "gemini":
      return "Gemini 1.5 Pro";
    case "mistral":
      return "Mistral Large";
    case "claude":
      return "Claude 3.5 Sonnet";
    case "llama":
      return "LLaMA 3.1 405B";
  }
};

const ChatResponseCard = ({
  type,
  aiModel,
  date,
  response,
}: ChatResponseCardProps) => {
  return (
    <div className="relative flex flex-col gap-[4px] ml-[16px] self-end">
      {type === "ai" && aiModel ? (
        <ChatAiIcon aiModel={aiModel} />
      ) : (
        <ChatProfileIcon />
      )}
      <div className="flex gap-[8px] items-center text-[#1E1F22] ml-[24px]">
        <span className="text-[12px] font-bold ">
          {type === "ai" && aiModel ? getAiModelName(aiModel) : "You"}
        </span>
        <span className="text-[10px]">{date}</span>
      </div>
      <div className="min-h-[40px] w-fit bg-white rounded-lg py-[12px] px-[24px] flex items-center">
        <div className="text-[14px] text-[#1E1F22]">{response}</div>
      </div>
    </div>
  );
};

export default ChatResponseCard;
