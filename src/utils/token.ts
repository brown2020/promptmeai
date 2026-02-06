import { Message } from "@/zustand/useChatStore";
import { convertToSubcurrency } from "./number";
import { logger } from "./logger";

// Approximation: 1 token ≈ 4 characters (this is a common estimate for GPT models)
const AVERAGE_CHARACTERS_PER_TOKEN = 4;

// Maximum input length to prevent memory issues (~25k tokens)
const MAX_INPUT_LENGTH = 100_000;

/**
 * Count tokens based on the length of the text (character count).
 * Uses approximation of 4 characters per token.
 *
 * @param text - The input text to count tokens for
 * @returns The estimated number of tokens
 */
export function countTokens(text: string): number {
  // Validate input
  if (!text || typeof text !== "string") {
    return 0;
  }

  // Remove leading and trailing spaces
  const cleanedText = text.trim();

  // Check for excessively long input
  if (cleanedText.length > MAX_INPUT_LENGTH) {
    logger.warn(
      `Input exceeds max length of ${MAX_INPUT_LENGTH} characters. Truncating for token calculation.`
    );
    return Math.ceil(MAX_INPUT_LENGTH / AVERAGE_CHARACTERS_PER_TOKEN);
  }

  // Calculate the number of tokens as character count / 4 (approximation)
  return Math.ceil(cleanedText.length / AVERAGE_CHARACTERS_PER_TOKEN);
}

// Function to calculate cost based on input and output tokens for all models
export function calculateCost(tokens: number): number {
  // Define a flat rate per token for all models (replace with the agreed rate)
  const flatRatePerToken = 0.04 / 1000; // Example: $0.04 per 1,000 tokens

  // Calculate total cost using the flat rate
  const cost = tokens * flatRatePerToken;

  return cost;
}

// Function to calculate total token usage from a message
export function calculateTotalTokenUsage(message: Message): number {
  const userTokens = message.userMessage?.tokenUsage ?? 0;
  const responseTokens = Object.values(message.responses).reduce(
    (sum, response) => sum + (response?.tokenUsage ?? 0),
    0
  );
  return userTokens + responseTokens;
}

// Function to calculate total token credit cost
export function calculateCreditCost(tokens: number, round = true): number {
  const totalCost = calculateCost(tokens);

  return convertToSubcurrency(totalCost, 100, round);
}
