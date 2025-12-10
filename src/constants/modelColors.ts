import { ModelName } from "./modelNames";

/**
 * Background colors for each AI model's response cards.
 * Uses brand-appropriate colors with transparency for light mode.
 */
export const MODEL_COLORS: Record<ModelName, string> = {
  "gpt-5.1-chat-latest": "bg-[#14A27F]/[0.15]",
  "claude-sonnet-4-5": "bg-[#F39C12]/[0.15]",
  "gemini-2.5-flash": "bg-[#FF6F61]/[0.15]",
  "mistral-small-latest": "bg-[#3498DB]/[0.15]",
  "llama-v3p1-8b-instruct": "bg-[#8E44AD]/[0.15]",
} as const;

/**
 * Get the background color class for a model by its key.
 * Falls back to transparent if model not found.
 */
export const getModelColor = (modelKey: string): string => {
  return MODEL_COLORS[modelKey as ModelName] ?? "bg-transparent";
};

/**
 * Get the background color class for a model by its display label.
 * Falls back to transparent if model not found.
 */
export const getModelColorByLabel = (label: string): string => {
  const lowerLabel = label.toLowerCase();

  if (lowerLabel.includes("gpt")) return MODEL_COLORS["gpt-5.1-chat-latest"];
  if (lowerLabel.includes("claude")) return MODEL_COLORS["claude-sonnet-4-5"];
  if (lowerLabel.includes("gemini")) return MODEL_COLORS["gemini-2.5-flash"];
  if (lowerLabel.includes("mistral"))
    return MODEL_COLORS["mistral-small-latest"];
  if (lowerLabel.includes("llama"))
    return MODEL_COLORS["llama-v3p1-8b-instruct"];

  return "bg-transparent";
};
