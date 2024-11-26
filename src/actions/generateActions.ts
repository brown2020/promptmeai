"use server";

import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { APIKeys, UsageMode } from "@/zustand/useProfileStore";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createMistral } from "@ai-sdk/mistral";
import { createAnthropic } from "@ai-sdk/anthropic";

async function getModel(modelName: string, apiKeys: APIKeys | UsageMode) {
  switch (modelName) {
    case "gpt-4o":
      return createOpenAI({
        apiKey:
          apiKeys === UsageMode.Credits
            ? process.env.OPENAI_API_KEY
            : (apiKeys as APIKeys)?.openAi || "",
      })("gpt-4o");
    case "gemini-1.5-pro":
      return createGoogleGenerativeAI({
        apiKey:
          apiKeys === UsageMode.Credits
            ? process.env.GOOGLE_GENERATIVE_AI_API_KEY
            : (apiKeys as APIKeys)?.googleGenerativeAi || "",
      })("models/gemini-1.5-pro-latest");
    case "mistral-large":
      return createMistral({
        apiKey:
          apiKeys === UsageMode.Credits
            ? process.env.MISTRAL_API_KEY
            : (apiKeys as APIKeys)?.mistral || "",
      })("mistral-large-latest");
    case "claude-3-5-sonnet":
      return createAnthropic({
        apiKey:
          apiKeys === UsageMode.Credits
            ? process.env.ANTHROPIC_API_KEY
            : (apiKeys as APIKeys)?.anthropic || "",
      })("claude-3-5-sonnet-20241022");
    case "llama-v3p1-405b":
      return createOpenAI({
        apiKey:
          apiKeys === UsageMode.Credits
            ? process.env.FIREWORKS_API_KEY
            : (apiKeys as APIKeys)?.fireworks || "",
        baseURL: "https://api.fireworks.ai/inference/v1",
      })("accounts/fireworks/models/llama-v3p1-405b-instruct");

    default:
      throw new Error(`Unsupported model name: ${modelName}`);
  }
}

export async function continueConversation(
  messages: CoreMessage[],
  modelName: string = "gpt-4o",
  apiKeys: APIKeys | UsageMode
) {
  const model = await getModel(modelName, apiKeys);

  const result = streamText({
    model,
    messages,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}

export async function generateResponse(
  systemPrompt: string,
  userPrompt: string,
  modelName: string = "gpt-4o",
  apiKeys: APIKeys | UsageMode
) {
  const model = await getModel(modelName, apiKeys);

  const messages: CoreMessage[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ];

  const result = streamText({
    model,
    messages,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}
