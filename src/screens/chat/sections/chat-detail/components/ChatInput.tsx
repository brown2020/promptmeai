"use client";

import { cancelGeneration, continueConversation } from "@/actions/generateActions";
import { ModalWarning } from "@/components/modals";
import { MODEL_NAMES, ModelName } from "@/constants/modelNames";
import { saveChat, updateChat } from "@/services/chatService";
import { isObjectEmpty } from "@/utils/object";
import { logger } from "@/utils/logger";
import {
  calculateTotalTokenUsage,
  countTokens,
} from "@/utils/token";
import { useChatSideBarStore } from "@/zustand/useChatSideBarStore";
import { PromptCoreMessage, useChatStore } from "@/zustand/useChatStore";
import useProfileStore, { UsageMode } from "@/zustand/useProfileStore";
import { usePlatform } from "@/zustand/usePlatformStore";
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
import toast from "react-hot-toast";
import { auth } from "@/firebase/firebaseClient";

const ChatInput = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const { profile, isDefaultData, fetchProfile } = useProfileStore();
  const { isRNWebView } = usePlatform();
  const {
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
  const [isOutOfCredits, setIsOutOfCredits] = useState<boolean>(false);
  const [isStopRequest, setIsStopRequest] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  // Synchronous guard against double-submit: `isLoading` is only set after an
  // awaited save, so rapid Enter presses could fire two submissions (and double
  // the credit charge) before state updates. A ref blocks that immediately.
  const isSubmittingRef = useRef<boolean>(false);
  const requestIdRef = useRef<string | undefined>(undefined);
  const showAlert =
    profile.usageMode === UsageMode.Credits
      ? profile.credits <= 10
      : isObjectEmpty(profile.APIKeys);
  const alertCredits = isRNWebView
    ? "Your credit balance is exhausted."
    : "Your credit balance is exhausted. Please purchase more credits or provide your API keys to continue.";
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
      signal?: AbortSignal
    ): Promise<"answered" | "silent" | "no_credits"> => {
      try {
        // The latest user message is already part of the store (added by
        // initialMessage) and is therefore included here; do not append it
        // again or the model receives the prompt twice.
        const currentMessages: ModelMessage[] = useChatStore
          .getState()
          .messages.flatMap((message) => [
            message.userMessage,
            ...Object.values(message.responses),
          ]);

        const response = await continueConversation(
          currentMessages,
          model,
          profile.usageMode === UsageMode.Credits
            ? profile.usageMode
            : {
                openAi: "",
                anthropic: "",
                googleGenerativeAi: "",
              },
          requestIdRef.current
        );

        if (response.status === "insufficient_credits") return "no_credits";

        let hasContent = false;

        for await (const content of readStreamableValue(response.stream)) {
          if (signal?.aborted) {
            logger.log("Aborted request", model);
            break;
          }

          const responseContent = typeof content === "string" ? content : "";

          if (responseContent) {
            hasContent = true;
          }

          useChatStore.getState().addResponse(model, {
            role: "assistant",
            content: responseContent,
            tokenUsage: responseContent ? countTokens(responseContent) : 0,
          });
        }

        return hasContent ? "answered" : "silent";
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            logger.log("Request aborted.");
          } else {
            logger.warn("[chat] model did not respond:", model, error.message);
          }
        } else {
          logger.error("Unknown error:", error);
        }

        return "silent";
      }
    },
    [profile.usageMode]
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

  const initialMessage = async () => {
    const newUserMessage: PromptCoreMessage = {
      content: input,
      role: "user",
      tokenUsage: countTokens(input),
    };
    addMessage(newUserMessage);
    setInput("");
    setActiveTab("chats");

    try {
      await saveChatFunction();
    } catch (error) {
      logger.error("Failed to save initial message:", error);
    }

    return newUserMessage;
  };

  const submitHandler = async () => {
    if (!input || isLoading || isStopRequest || isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    try {
      await initialMessage();

      setIsLoading(true);
      requestIdRef.current = crypto.randomUUID();
      useChatStore.getState().setActiveRequestId(requestIdRef.current);
      const abortController = new AbortController();
      setAbortController(abortController);
      const signal = abortController.signal;

      const results = await Promise.allSettled(
        MODEL_NAMES.map(({ value }) => getAssistantResponse(value, signal))
      );

      const outcomes = results.map((result) =>
        result.status === "fulfilled" ? result.value : "silent"
      );
      const silentModels = MODEL_NAMES.filter(
        (_, i) => outcomes[i] !== "answered"
      ).map(({ label }) => label);

      if (signal.aborted) {
        await saveChatFunction();
      } else if (silentModels.length < MODEL_NAMES.length) {
        const totalTokenUsage = await saveChatFunction();

        logger.log("Total token proceed", totalTokenUsage);

        if (totalTokenUsage && profile.usageMode === UsageMode.Credits) {
          await fetchProfile();
        }
        if (silentModels.length > 0) {
          toast.error(
            `${silentModels.join(" and ")} did not respond. The other answers were saved.`,
            { id: "partial-outage" }
          );
        }
      } else {
        logger.warn("No model responded.");
        const unanswered = useChatStore.getState().messages.at(-1);
        const remaining = useChatStore.getState().messages.slice(0, -1);
        setMessages(remaining);
        setInput(String(unanswered?.userMessage.content ?? ""));
        const activeChatId = useChatSideBarStore.getState().activeChatId;
        if (user?.uid && activeChatId && remaining.length > 0) {
          await updateChat(user.uid, activeChatId, remaining);
        }
        if (outcomes.includes("no_credits")) {
          await fetchProfile();
          setIsOutOfCredits(true);
        } else if (profile.usageMode === UsageMode.Credits) {
          toast.error(
            "The models did not respond, so nothing was charged. Your prompt is back in the box. Try again in a moment.",
            { id: "full-outage" }
          );
        } else {
          setIsAlertAPIKeysNotWorking(true);
        }
      }

      setIsStopRequest(false);
    } catch (error) {
      logger.error("Error handling submission: ", error);
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
      useChatStore.getState().setActiveRequestId(undefined);
    }
  };

  const stopRequest = () => {
    if (!isStopRequest) {
      setIsStopRequest(true);
      if (requestIdRef.current) void cancelGeneration(requestIdRef.current).catch(() => undefined);
      abortController?.abort();
      setAbortController(undefined);
    }
  };

  return (
    <Fragment>
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
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitHandler()}
          />
          <button
            type="button"
            aria-label={isLoading ? "Stop generating" : "Send prompt"}
            className="flex size-11 items-center justify-center rounded-lg cursor-pointer shrink-0 -mr-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A8F70]"
            onClick={() => (isLoading ? stopRequest() : submitHandler())}
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
      <ModalWarning
        isOpen={
          (!isDefaultData && showAlert) || isAlertAPIKeysNotWorking || isOutOfCredits
        }
        title={
          isAlertAPIKeysNotWorking
            ? alertAPIKeysNotWorking
            : profile?.usageMode === UsageMode.Credits
            ? alertCredits
            : alertAPIKeys
        }
        confirmText="Go to settings page"
        onConfirm={() => router.push("/settings")}
      />
    </Fragment>
  );
};

export default memo(ChatInput);
