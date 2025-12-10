"use client";

import { continueConversation } from "@/actions/generateActions";
import { ModalWarning } from "@/components/modals";
import { MODEL_NAMES, ModelName } from "@/constants/modelNames";
import { saveChat, updateChat } from "@/services/chatService";
import { isObjectEmpty } from "@/utils/object";
import { logger } from "@/utils/logger";
import {
  calculateCreditCost,
  calculateTotalTokenUsage,
  countTokens,
} from "@/utils/token";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { PromptCoreMessage, useChatStore } from "@/zustand/useChatStore";
import useProfileStore, { UsageMode } from "@/zustand/useProfileStore";
import { FaStopCircle } from "react-icons/fa";
import { ModelMessage } from "ai";
import { readStreamableValue } from "@ai-sdk/rsc";
import { useRouter } from "next/navigation";
import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { PiPaperPlaneTilt } from "react-icons/pi";
import { Spinner } from "@nextui-org/react";
import { auth } from "@/firebase/firebaseClient";

const ChatInput = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const { profile, isDefaultData, reduceCredits } = useProfileStore();
  const {
    messages,
    addMessage,
    setMessages,
    setIsLoading,
    isLoading,
    setAbortController,
    abortController,
  } = useChatStore();
  const { addChat, setActiveChatId, setActiveTab } = useChatSideBarStore();

  const [isAlertAPIKeysNotWorking, setIsAlertAPIKeysNotWorking] =
    useState<boolean>(false);
  const [isStopRequest, setIsStopRequest] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const showAlert =
    profile.usageMode === UsageMode.Credits
      ? profile.credits <= 10
      : isObjectEmpty(profile.APIKeys);
  const alertCredits =
    "Your credit balance is exhausted. Please purchase more credits or provide your API keys to continue.";
  const alertAPIKeys =
    "API keys have not been set up yet. Please configure your API keys to proceed.";
  const alertAPIKeysNotWorking =
    "No valid API keys detected. Please configure your API keys to continue.";

  const [input, setInput] = useState<string>("");

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const getAssistantResponse = useCallback(
    async (
      model: ModelName,
      userMessage: ModelMessage,
      signal?: AbortSignal
    ) => {
      try {
        const currentMessages: ModelMessage[] = messages.flatMap((message) => [
          message.userMessage,
          ...Object.values(message.responses),
        ]);

        const result = await continueConversation(
          [...currentMessages, userMessage],
          model,
          profile.usageMode === UsageMode.Credits
            ? profile.usageMode
            : profile.APIKeys
        );

        for await (const content of readStreamableValue(result)) {
          if (signal?.aborted) {
            logger.log("Aborted request", model);
            break;
          }

          useChatStore.getState().addResponse(model, {
            role: "assistant",
            content: content as string,
            tokenUsage: content ? countTokens(content) : 0,
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            logger.log("Request aborted.");
          } else {
            logger.error("Error fetching assistant response:", error.message);
          }
        } else {
          logger.error("Unknown error:", error);
        }
      }
    },
    [messages, profile.APIKeys, profile.usageMode]
  );

  const saveChatFunction = async () => {
    if (user?.uid) {
      try {
        const newMessages = [...useChatStore.getState().messages];
        const lastIndex = newMessages.length - 1;
        const lastMessage = newMessages[lastIndex];
        const totalTokenUsage = calculateTotalTokenUsage(lastMessage);
        newMessages[lastIndex] = {
          ...lastMessage,
          totalTokenUsage,
        };

        const activeChatId = useChatSideBarStore.getState().activeChatId;

        if (activeChatId) {
          await updateChat(user.uid, activeChatId, newMessages);
        } else {
          const chatData = await saveChat(
            user.uid,
            user.displayName || "",
            newMessages
          );
          if (chatData?.id) {
            addChat(chatData);
            setActiveChatId(chatData.id, true);
          }
        }

        return totalTokenUsage;
      } catch (error) {
        logger.error("Error saving or updating chat: ", error);
      }
    }
  };

  const initialMessage = () => {
    const newUserMessage: PromptCoreMessage = {
      content: input,
      role: "user",
      tokenUsage: countTokens(input),
    };
    addMessage(newUserMessage);
    setInput("");
    setActiveTab("chats");

    saveChatFunction();

    return newUserMessage;
  };

  const submitHandler = async () => {
    if (!input || isLoading || isStopRequest) return;

    const newUserMessage = initialMessage();

    setIsLoading(true);
    try {
      const abortController = new AbortController();
      setAbortController(abortController);
      const signal = abortController.signal;

      const results = await Promise.allSettled(
        MODEL_NAMES.map(({ value }) =>
          getAssistantResponse(value, newUserMessage, signal)
        )
      );

      // Filter fulfilled results
      const successfulResponses = results.filter(
        (result) => result.status === "fulfilled"
      );

      if (successfulResponses.length > 0) {
        const totalTokenUsage = await saveChatFunction();

        logger.log("Total token proceed", totalTokenUsage);

        if (totalTokenUsage && profile.usageMode === UsageMode.Credits) {
          const totalCreditUse = calculateCreditCost(totalTokenUsage);
          reduceCredits(totalCreditUse);
        }
      } else {
        logger.error("All promises failed.");

        setIsAlertAPIKeysNotWorking(true);
        setMessages([]);
      }

      setIsLoading(false);
      setIsStopRequest(false);
    } catch (error) {
      logger.error("Error handling submission: ", error);
      setIsLoading(false);
    }
  };

  const stopRequest = () => {
    if (!isStopRequest) {
      setIsStopRequest(true);
      abortController?.abort();
      setAbortController(undefined);
    }
  };

  return (
    <Fragment>
      <div className="self-end w-full max-w-[720px] h-[56px] shrink-0 flex gap-[16px] justify-center items-center">
        <div className="w-full bg-white dark:bg-[#4B4F5B] rounded-xl shadow-sm px-[16px] py-[12px] flex gap-[12px] items-center">
          <input
            ref={inputRef}
            className="w-full text-[16px] dark:bg-[#4B4F5B] text-[#A0A7BB] outline-hidden"
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitHandler()}
          />
          <div
            className="flex items-center justify-center h-[32px] w-[32px] rounded-lg cursor-pointer shrink-0 mr-[-4px]"
            onClick={() => (isLoading ? stopRequest() : submitHandler())}
          >
            {isLoading && !isStopRequest ? (
              <FaStopCircle size={24} />
            ) : isStopRequest ? (
              <Spinner size="sm" color="default" />
            ) : (
              <PiPaperPlaneTilt size={20} color="#ABABAB" />
            )}
          </div>
        </div>
      </div>
      <ModalWarning
        isOpen={(!isDefaultData && showAlert) || isAlertAPIKeysNotWorking}
        title={
          profile?.usageMode === UsageMode.Credits
            ? alertCredits
            : isAlertAPIKeysNotWorking
            ? alertAPIKeysNotWorking
            : alertAPIKeys
        }
        confirmText="Go to settings page"
        onConfirm={() => router.push("/settings")}
      />
    </Fragment>
  );
};

export default memo(ChatInput);
