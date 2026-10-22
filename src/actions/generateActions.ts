"use server";

import { MODEL_CONFIG, MODEL_NAMES, ModelName } from "@/constants/modelNames";
import { createStreamableValue } from '@ai-sdk/rsc';
import { ModelMessage, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { APIKeys, UsageMode } from "@/zustand/useProfileStore";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";
import { verifyAuth } from "@/firebase/firebaseAdmin";
import {
  deductCredits,
  hasCreditsAvailable,
} from "@/firebase/creditLedger";
import type { StreamableValue } from "@ai-sdk/rsc";
import { calculateCreditCost, countTokens } from "@/utils/token";
import { parseConversationInput } from "./inputs";

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

export type ConversationResponse =
  | { status: "ok"; stream: StreamableValue<string> }
  | { status: "insufficient_credits" };

export async function continueConversation(
  rawMessages: ModelMessage[],
  rawModelName: ModelName = DEFAULT_MODEL,
  rawApiKeys: APIKeys | UsageMode
): Promise<ConversationResponse> {
  const uid = await verifyAuth();
  const { messages, modelName, apiKeys } = parseConversationInput(
    rawMessages,
    rawModelName,
    rawApiKeys
  );
  const chargesCredits = apiKeys === UsageMode.Credits;

  if (chargesCredits && !(await hasCreditsAvailable(uid))) {
    return { status: "insufficient_credits" };
  }

  const model = getModel(modelName, apiKeys);
  const result = streamText({
    model,
    messages,
  });

  const inputTokens = messages.reduce(
    (sum, message) => sum + countTokens(messageText(message)),
    0
  );
  const inputShare =
    inputTokens === 0 ? 0 : Math.ceil(inputTokens / MODEL_NAMES.length);

  const textStream = chargesCredits
    ? result.textStream.tee()
    : [result.textStream];
  const clientStream = textStream[0];
  const billingStream = textStream[1];

  if (billingStream) {
    void deductStream(uid, inputShare, billingStream);
  }

  const stream = createStreamableValue(clientStream);
  return { status: "ok", stream: stream.value };
}

async function deductStream(
  uid: string,
  inputShare: number,
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
  } finally {
    reader.releaseLock();
  }

  if (!output.trim()) return;

  try {
    await deductCredits(
      uid,
      calculateCreditCost(inputShare + countTokens(output))
    );
  } catch (error) {
    console.error("Error deducting credits:", error);
  }
}
