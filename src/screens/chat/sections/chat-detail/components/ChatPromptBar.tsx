import { FaStopCircle } from "react-icons/fa";
import { PiPaperPlaneTilt } from "react-icons/pi";
import { Spinner } from "@nextui-org/react";
import type { RefObject } from "react";

type Props = {
  inputRef: RefObject<HTMLInputElement | null>;
  input: string;
  isLoading: boolean;
  isStopRequest: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
};

const ChatPromptBar = ({
  inputRef,
  input,
  isLoading,
  isStopRequest,
  onInputChange,
  onSubmit,
  onStop,
}: Props) => (
  <div className="self-end w-full max-w-3xl h-14 shrink-0 flex gap-4 justify-center items-center">
    <div className="w-full bg-white dark:bg-gray-700 rounded-xl shadow-sm px-4 py-3 flex gap-3 items-center focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#1A8F70]">
      <label htmlFor="chat-prompt" className="sr-only">
        Prompt
      </label>
      <input
        id="chat-prompt"
        name="prompt"
        ref={inputRef}
        className="w-full text-base bg-transparent dark:bg-transparent text-gray-600 dark:text-gray-300 outline-none"
        placeholder="Type your question here…"
        aria-label="Type your question"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
      />
      <button
        type="button"
        aria-label={isLoading ? "Stop generating" : "Send prompt"}
        className="flex size-11 items-center justify-center rounded-lg cursor-pointer shrink-0 -mr-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A8F70]"
        onClick={() => (isLoading ? onStop() : onSubmit())}
      >
        <span aria-hidden className="flex items-center justify-center">
          {isLoading && !isStopRequest ? (
            <FaStopCircle size={24} />
          ) : isStopRequest ? (
            <Spinner size="sm" color="default" />
          ) : (
            <PiPaperPlaneTilt size={20} className="text-gray-400" />
          )}
        </span>
      </button>
    </div>
  </div>
);

export default ChatPromptBar;
