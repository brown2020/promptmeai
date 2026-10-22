import { APIKeys } from "@/zustand/useProfileStore";

type ProviderId = "openai" | "google" | "anthropic";

type ModelConfig = {
  label: string;
  provider: ProviderId;
  modelId: string;
  apiKeyProp: keyof APIKeys;
  envKey: string;
};

export const MODEL_CONFIG = {
  "gpt-6.1-sol": {
    label: "GPT-6.1 Sol",
    provider: "openai",
    modelId: "gpt-6.1-sol",
    apiKeyProp: "openAi",
    envKey: "OPENAI_API_KEY",
  },
  "claude-opus-5-5": {
    label: "Claude Opus 5.5",
    provider: "anthropic",
    modelId: "claude-opus-5-5",
    apiKeyProp: "anthropic",
    envKey: "ANTHROPIC_API_KEY",
  },
  "gemini-4-argon": {
    label: "Gemini 4 Argon",
    provider: "google",
    modelId: "gemini-4-argon",
    apiKeyProp: "googleGenerativeAi",
    envKey: "GOOGLE_GENERATIVE_AI_API_KEY",
  },
} as const satisfies Record<string, ModelConfig>;

export type ModelName = keyof typeof MODEL_CONFIG;

export const MODEL_NAMES: ReadonlyArray<{ label: string; value: ModelName }> =
  Object.entries(MODEL_CONFIG).map(([value, config]) => ({
    label: config.label,
    value: value as ModelName,
  }));

/** Labels for response keys saved by earlier model lineups. */
const LEGACY_MODEL_LABELS: Record<string, string> = {
  "gpt-5.5": "GPT-5.5",
  "claude-sonnet-4-6": "Claude Sonnet 4.6",
  "gemini-3.5-flash": "Gemini 3.5 Flash",
  "mistral-small-latest": "Mistral Small",
  "llama4-maverick-instruct-basic": "Llama 4 Maverick",
  "gpt-5.1-chat-latest": "GPT-5.1 Chat",
  "claude-sonnet-4-5": "Claude Sonnet 4.5",
  "gemini-2.5-flash": "Gemini 2.5 Flash",
  "llama-v3p1-8b-instruct": "LLaMA 3.1 8B Instruct",
  "gpt-4o": "GPT-4 Omni",
  "gemini-1.5-pro": "Gemini 1.5 Pro",
  "mistral-large": "Mistral Large",
  "claude-3-5-sonnet": "Claude 3.5 Sonnet",
  "llama-v3p1-405b": "LLaMA 3.1 405B",
  "llama-v3p1-405b-instruct": "LLaMA 3.1 405B",
};

/**
 * Orders a saved message's response keys for display: current models first,
 * then any keys left by earlier lineups, each with a readable label.
 */
export const responseEntriesForDisplay = (
  responseKeys: readonly string[]
): Array<{ key: string; label: string }> => {
  const saved = new Set(responseKeys);
  const current = MODEL_NAMES.filter(({ value }) => saved.has(value)).map(
    ({ value, label }) => ({ key: value, label })
  );
  const legacy = responseKeys
    .filter((key) => !(key in MODEL_CONFIG))
    .map((key) => ({ key, label: LEGACY_MODEL_LABELS[key] ?? key }));
  return [...current, ...legacy];
};
