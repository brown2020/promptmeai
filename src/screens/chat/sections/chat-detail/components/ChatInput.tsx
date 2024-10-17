"use client";

import { continueConversation } from "@/actions/generateActions";
import { ModalWarning } from "@/components/modals";
import { MODEL_NAMES } from "@/constants/modelNames";
import { saveChat, updateChat } from "@/services/chatService";
import { isObjectEmpty } from "@/utils/object";
import {
  calculateCreditCost,
  calculateTotalTokenUsage,
  countTokens,
} from "@/utils/token";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { PromptCoreMessage, useChatStore } from "@/zustand/useChatStore";
import useProfileStore, { UsageMode } from "@/zustand/useProfileStore";
import { useUser } from "@clerk/nextjs";
import { FaStopCircle } from "react-icons/fa";
import { CoreMessage } from "ai";
import { readStreamableValue } from "ai/rsc";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { PiPaperPlaneTilt } from "react-icons/pi";

const ChatInput = () => {
  const router = useRouter();
  const { user } = useUser();
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
  const { addChat, setActiveChatId } = useChatSideBarStore();

  const [isAlertAPIKeysNotWorking, setIsAlertAPIKeysNotWorking] =
    useState<boolean>(false);

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
      inputRef.current.focus(); // Automatically focus the input
    }
  }, []);

  const getAssistantResponse = useCallback(
    async (model: string, userMessage: CoreMessage, signal?: AbortSignal) => {
      try {
        const currentMessages: CoreMessage[] = messages.flatMap((message) => [
          message.userMessage,
          ...Object.values(message.responses),
        ]);

        // Remove signal here to avoid serialization issue
        const result = await continueConversation(
          [...currentMessages, userMessage],
          model,
          profile.usageMode === UsageMode.Credits
            ? profile.usageMode
            : profile.APIKeys
        );

        // Check for abort status within the loop
        for await (const content of readStreamableValue(result)) {
          if (signal?.aborted) {
            console.log("Aborted");
            break;
          }

          useChatStore.getState().addResponse(model, {
            role: "assistant",
            content: content as string,
            tokenUsage: content ? countTokens(content) : 0,
          });
        }
      } catch (error) {
        // Type guard to check if `error` has the expected properties
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            console.log("Request aborted.");
          } else {
            console.error("Error fetching assistant response:", error.message);
          }
        } else {
          console.error("Unknown error:", error);
        }
      }
    },
    [messages, profile.APIKeys, profile.usageMode]
  );

  const saveChatFunction = async () => {
    if (user?.id) {
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
          await updateChat(user.id, activeChatId, newMessages);
        } else {
          const chatData = await saveChat(
            user.id,
            user.fullName || "",
            newMessages
          );
          if (chatData?.id) {
            addChat(chatData);
            setActiveChatId(chatData.id, true);
          }
        }

        return totalTokenUsage;
      } catch (error) {
        console.error("Error saving or updating chat: ", error);
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

    saveChatFunction();

    return newUserMessage;
  };

  const submitHandler = async () => {
    if (!input || isLoading) return;

    const newUserMessage = initialMessage();

    setIsLoading(true);
    try {
      const abortController = new AbortController();
      setAbortController(abortController);
      const signal = abortController.signal;

      const results = await Promise.allSettled(
        MODEL_NAMES.map((model) =>
          getAssistantResponse(model.value, newUserMessage, signal)
        )
      );

      // Filter fulfilled results
      const successfulResponses = results.filter(
        (result) => result.status === "fulfilled"
      );

      if (successfulResponses.length > 0) {
        const totalTokenUsage = await saveChatFunction();

        console.log("call pay", successfulResponses, totalTokenUsage);

        if (totalTokenUsage && profile.usageMode === UsageMode.Credits) {
          const totalCreditUse = calculateCreditCost(totalTokenUsage);
          reduceCredits(totalCreditUse);
        }
      } else {
        console.error("All promises failed.");

        setIsAlertAPIKeysNotWorking(true);
        setMessages([]);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error handling submission: ", error);
      setIsLoading(false);
    }
  };

  const stopRequest = () => {
    abortController?.abort();
    setAbortController(undefined);
  };

  return (
    <Fragment>
      <div className="self-end w-full max-w-[720px] h-[56px] flex-shrink-0 flex gap-[16px] justify-center items-center">
        <div className="w-full bg-white rounded-xl shadow px-[16px] py-[12px] flex gap-[12px] items-center">
          <input
            ref={inputRef}
            className="w-full text-[16px] text-[#A0A7BB] outline-none"
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitHandler()}
          />
          <div
            className="flex items-center justify-center h-[32px] w-[32px] rounded-lg cursor-pointer flex-shrink-0 mr-[-4px]"
            onClick={() => (isLoading ? stopRequest() : submitHandler())}
          >
            {isLoading ? (
              <FaStopCircle size={24} />
            ) : (
              <PiPaperPlaneTilt size={24} color="#ABABAB" />
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

export default ChatInput;
