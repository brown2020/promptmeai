/**
 * Background colors for AI response cards, keyed by provider family so
 * responses saved by earlier model lineups keep their color.
 */
const PROVIDER_COLORS = {
  gpt: "bg-[#14A27F]/[0.15]",
  claude: "bg-[#F39C12]/[0.15]",
  gemini: "bg-[#FF6F61]/[0.15]",
} as const;

/**
 * Get the background color class for a model by its display label.
 * Falls back to transparent for unknown models.
 */
export const getModelColorByLabel = (label: string): string => {
  const lowerLabel = label.toLowerCase();

  if (lowerLabel.includes("gpt")) return PROVIDER_COLORS.gpt;
  if (lowerLabel.includes("claude")) return PROVIDER_COLORS.claude;
  if (lowerLabel.includes("gemini")) return PROVIDER_COLORS.gemini;

  return "bg-transparent";
};
