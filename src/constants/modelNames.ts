import { APIKeys } from "@/zustand/useProfileStore";

type ProviderId = "openai" | "google" | "mistral" | "anthropic";

type ModelConfig = {
  label: string;
  provider: ProviderId;
  modelId: string;
  apiKeyProp: keyof APIKeys;
  envKey: string;
  baseURL?: string;
};

export const MODEL_CONFIG = {
  "gpt-5.5": {
    label: "GPT-5.5",
    provider: "openai",
    modelId: "gpt-5.5",
    apiKeyProp: "openAi",
    envKey: "OPENAI_API_KEY",
  },
  "claude-sonnet-4-6": {
    label: "Claude Sonnet 4.6",
    provider: "anthropic",
    modelId: "claude-sonnet-4-6",
    apiKeyProp: "anthropic",
    envKey: "ANTHROPIC_API_KEY",
  },
  "gemini-3.5-flash": {
    label: "Gemini 3.5 Flash",
    provider: "google",
    modelId: "models/gemini-3.5-flash",
    apiKeyProp: "googleGenerativeAi",
    envKey: "GOOGLE_GENERATIVE_AI_API_KEY",
  },
  "mistral-small-latest": {
    label: "Mistral Small 4",
    provider: "mistral",
    modelId: "mistral-small-latest",
    apiKeyProp: "mistral",
    envKey: "MISTRAL_API_KEY",
  },
  "llama4-maverick-instruct-basic": {
    label: "Llama 4 Maverick",
    provider: "openai",
    modelId: "accounts/fireworks/models/llama4-maverick-instruct-basic",
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
