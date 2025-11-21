import { APIKeys } from "@/zustand/useProfileStore";

type ProviderId = "openai" | "google" | "mistral" | "anthropic";

export type ModelConfig = {
  label: string;
  provider: ProviderId;
  modelId: string;
  apiKeyProp: keyof APIKeys;
  envKey: string;
  baseURL?: string;
};

export const MODEL_CONFIG = {
  "gpt-5.1-chat-latest": {
    label: "GPT-5.1 Chat (Fast)",
    provider: "openai",
    modelId: "gpt-5.1-chat-latest",
    apiKeyProp: "openAi",
    envKey: "OPENAI_API_KEY",
  },
  "claude-sonnet-4-5": {
    label: "Claude Sonnet 4.5 (Fast)",
    provider: "anthropic",
    modelId: "claude-sonnet-4-5",
    apiKeyProp: "anthropic",
    envKey: "ANTHROPIC_API_KEY",
  },
  "gemini-2.5-flash": {
    label: "Gemini 2.5 Flash",
    provider: "google",
    modelId: "models/gemini-2.5-flash",
    apiKeyProp: "googleGenerativeAi",
    envKey: "GOOGLE_GENERATIVE_AI_API_KEY",
  },
  "mistral-small-latest": {
    label: "Mistral Small Latest",
    provider: "mistral",
    modelId: "mistral-small-latest",
    apiKeyProp: "mistral",
    envKey: "MISTRAL_API_KEY",
  },
  "llama-v3p1-8b-instruct": {
    label: "LLaMA 3.1 8B Instruct",
    provider: "openai",
    modelId: "accounts/fireworks/models/llama-v3p1-8b-instruct",
    apiKeyProp: "fireworks",
    envKey: "FIREWORKS_API_KEY",
    baseURL: "https://api.fireworks.ai/inference/v1",
  },
} as const satisfies Record<string, ModelConfig>;

export type ModelName = keyof typeof MODEL_CONFIG;

export const MODEL_NAMES: ReadonlyArray<{ label: string; value: ModelName }> =
  Object.entries(MODEL_CONFIG).map(([value, config]) => ({
    label: config.label,
    value: value as ModelName,
  }));
