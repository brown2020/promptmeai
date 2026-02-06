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

const DEFAULT_MODEL = (
  MODEL_NAMES[0]?.value ?? "gpt-5.1-chat-latest"
) as ModelName;

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
    case "openai": {
      const baseURL = "baseURL" in config ? config.baseURL : undefined;
      return createOpenAI({
        apiKey,
        ...(baseURL ? { baseURL } : {}),
      })(config.modelId);
    }
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

export async function continueConversation(
  messages: ModelMessage[],
  modelName: ModelName = DEFAULT_MODEL,
  apiKeys: APIKeys | UsageMode
) {
  await verifyAuth();

  const model = await getModel(modelName, apiKeys);

  const result = streamText({
    model,
    messages,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}
