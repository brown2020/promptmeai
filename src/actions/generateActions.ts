"use server";

import { MODEL_CONFIG, MODEL_NAMES, ModelName } from "@/constants/modelNames";
import { createStreamableValue } from '@ai-sdk/rsc';
import { ModelMessage, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { APIKeys, UsageMode } from "@/zustand/useProfileStore";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createMistral } from "@ai-sdk/mistral";
import { createAnthropic } from "@ai-sdk/anthropic";
import { verifyAuth } from "@/firebase/firebaseAdmin";
import {
  assertCreditsAvailable,
  deductCredits,
} from "@/firebase/creditLedger";
import { calculateCreditCost, countTokens } from "@/utils/token";

const DEFAULT_MODEL = (MODEL_NAMES[0]?.value ?? "gpt-5.5") as ModelName;

const isUsageMode = (value: APIKeys | UsageMode): value is UsageMode =>
  typeof value === "string";

const resolveApiKey = (
  apiKeys: APIKeys | UsageMode,
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

  if (isUsageMode(apiKeys)) {
    throw new Error(
      "Usage mode is set to API keys, but no API key object was provided."
    );
  }

  const userKey = apiKeys[config.apiKeyProp];
  if (!userKey) {
    throw new Error(
      `Missing ${config.apiKeyProp} API key for model ${config.label}.`
    );
  }

  return userKey;
};

async function getModel(modelName: ModelName, apiKeys: APIKeys | UsageMode) {
  const config = MODEL_CONFIG[modelName];

  if (!config) {
    throw new Error(`Unsupported model name: ${modelName}`);
  }

  const apiKey = resolveApiKey(apiKeys, config);

  switch (config.provider) {
    case "openai":
      return createOpenAI({
        apiKey,
      })(config.modelId);
    case "google":
      return createGoogleGenerativeAI({
        apiKey,
      })(config.modelId);
    case "mistral":
      return createMistral({
        apiKey,
      })(config.modelId);
    case "anthropic":
      return createAnthropic({
        apiKey,
      })(config.modelId);
    default:
      throw new Error(`Unsupported provider for model: ${modelName}`);
  }
}

const messageText = (message: ModelMessage): string => {
  if (typeof message.content === "string") return message.content;
  if (!Array.isArray(message.content)) return "";
  return message.content
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");
};

export async function continueConversation(
  messages: ModelMessage[],
  modelName: ModelName = DEFAULT_MODEL,
  apiKeys: APIKeys | UsageMode
) {
  const uid = await verifyAuth();
  const chargesCredits = apiKeys === UsageMode.Credits;

  if (chargesCredits) {
    await assertCreditsAvailable(uid);
  }

  const model = await getModel(modelName, apiKeys);
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
  return stream.value;
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
