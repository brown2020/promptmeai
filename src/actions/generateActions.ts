"use server";

import { MODEL_CONFIG, ModelName } from "@/constants/modelNames";
import { createStreamableValue } from '@ai-sdk/rsc';
import { after } from "next/server";
import { ModelMessage, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { APIKeys, UsageMode } from "@/zustand/useProfileStore";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";
import { verifyAuth } from "@/firebase/firebaseAdmin";
import {
  ensureUserProfile,
  loadAuthIdentity,
  refundCredits,
  reserveCredits,
} from "@/firebase/creditLedger";
import type { StreamableValue } from "@ai-sdk/rsc";
import {
  billableCredits,
  boundPromptText,
  countTokens,
  MAX_OUTPUT_TOKENS,
  reservedCredits,
} from "@/utils/token";
import { parseConversationInput, parseRequestId } from "./inputs";
import {
  requestCancellation,
  watchCancellation,
} from "@/firebase/generationControl";

const DEFAULT_MODEL: ModelName = "gpt-6.1-sol";

const resolveApiKey = (
  apiKeys: APIKeys | UsageMode.Credits,
  config: (typeof MODEL_CONFIG)[ModelName]
): string => {
  if (apiKeys === UsageMode.Credits) {
    const envKey = process.env[config.envKey];
    if (!envKey) {
      throw new Error(
        `Missing environment variable for ${config.label}: ${config.envKey}`
      );
    }
    return envKey;
  }

  const userKey = apiKeys[config.apiKeyProp];
  if (!userKey) {
    throw new Error(
      `Missing ${config.apiKeyProp} API key for model ${config.label}.`
    );
  }

  return userKey;
};

function getModel(modelName: ModelName, apiKeys: APIKeys | UsageMode.Credits) {
  const config = MODEL_CONFIG[modelName];
  const apiKey = resolveApiKey(apiKeys, config);

  switch (config.provider) {
    case "openai":
      return createOpenAI({ apiKey })(config.modelId);
    case "google":
      return createGoogleGenerativeAI({
        apiKey,
        baseURL: process.env.GOOGLE_GENERATIVE_AI_BASE_URL,
      })(config.modelId);
    case "anthropic":
      return createAnthropic({ apiKey })(config.modelId);
  }
}

const messageText = (message: ModelMessage): string => {
  if (typeof message.content === "string") return message.content;
  if (!Array.isArray(message.content)) return "";
  return message.content
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");
};

/** Cuts each message to the slice that token billing counts. */
const boundMessages = (messages: ModelMessage[]): ModelMessage[] =>
  messages.map((message) => {
    const content = boundPromptText(messageText(message));
    if (message.role === "assistant") return { ...message, content };
    if (message.role === "system") return { ...message, content };
    if (message.role === "user") return { ...message, content };
    return message;
  });

/** Aborts the provider call when the browser stops reading the response. */
const abortOnCancel = (
  stream: ReadableStream<string>,
  abort: AbortController
): ReadableStream<string> => {
  const reader = stream.getReader();
  return new ReadableStream<string>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      controller.enqueue(value);
    },
    cancel(reason) {
      abort.abort();
      return reader.cancel(reason);
    },
  });
};

export type ConversationResponse =
  | { status: "ok"; stream: StreamableValue<string> }
  | { status: "insufficient_credits" };

export async function continueConversation(
  rawMessages: ModelMessage[],
  rawModelName: ModelName = DEFAULT_MODEL,
  rawApiKeys: APIKeys | UsageMode,
  rawRequestId?: string
): Promise<ConversationResponse> {
  const uid = await verifyAuth();
  const parsed = parseConversationInput(
    rawMessages,
    rawModelName,
    rawApiKeys,
    rawRequestId
  );
  const messages = boundMessages(parsed.messages);
  const { modelName, apiKeys, requestId } = parsed;
  const chargesCredits = apiKeys === UsageMode.Credits;
  const inputTokens = messages.reduce(
    (sum, message) => sum + countTokens(messageText(message)),
    0
  );

  let reserved = 0;
  if (chargesCredits) {
    await ensureUserProfile(uid, await loadAuthIdentity(uid));
    reserved = reservedCredits(inputTokens);
    if (!(await reserveCredits(uid, reserved))) {
      return { status: "insufficient_credits" };
    }
  }

  try {
    const model = getModel(modelName, apiKeys);
    const abort = new AbortController();
    const stopWatching = requestId
      ? watchCancellation(uid, requestId, () => abort.abort())
      : () => undefined;
    const result = streamText({
      model,
      messages,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      abortSignal: abort.signal,
      onFinish: () => stopWatching(),
      onAbort: () => stopWatching(),
      onError: ({ error }) => {
        stopWatching();
        after(() =>
          console.warn(
            `[generate] ${modelName} failed:`,
            error instanceof Error ? error.message : error
          )
        );
      },
    });

    const branches = chargesCredits
      ? result.textStream.tee()
      : [result.textStream];
    const clientStream = abortOnCancel(branches[0], abort);
    const billingStream = branches[1];

    if (billingStream) {
      const settling = settleReservation(uid, reserved, inputTokens, billingStream);
      try {
        after(() => settling);
      } catch {
        void settling;
      }
    }

    const stream = createStreamableValue(clientStream);
    return { status: "ok", stream: stream.value };
  } catch (error) {
    if (reserved > 0) await refundCredits(uid, reserved).catch(() => undefined);
    throw error;
  }
}

async function settleReservation(
  uid: string,
  reserved: number,
  inputTokens: number,
  billingStream: ReadableStream<string>
) {
  const reader = billingStream.getReader();
  let output = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) output += value;
    }
  } catch (error) {
    console.error("Error reading billable output:", error);
    return;
  } finally {
    reader.releaseLock();
  }

  try {
    if (!output.trim()) {
      await refundCredits(uid, reserved);
      return;
    }

    const actual = billableCredits(inputTokens + countTokens(output));
    if (actual < reserved) {
      await refundCredits(uid, reserved - actual);
    }
  } catch (error) {
    console.error("Error settling credits:", error);
  }
}

/** Stops every model call that shares this request id, on any server instance. */
export async function cancelGeneration(rawRequestId: string) {
  const uid = await verifyAuth();
  await requestCancellation(uid, parseRequestId(rawRequestId));
}
