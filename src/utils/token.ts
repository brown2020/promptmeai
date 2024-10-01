import { Message } from "@/zustand/useChatStore";
import { convertToSubcurrency } from "./number";

// Approximation: 1 token ≈ 4 characters (this is a common estimate for GPT models)
const AVERAGE_CHARACTERS_PER_TOKEN = 4;

// Function to count tokens based on the length of the text (character count)
export function countTokens(text: string): number {
  // Remove leading and trailing spaces
  const cleanedText = text.trim();

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
export function calculateTotalTokenUsage(message: Message) {
  let totalTokenUsage = message.userMessage?.tokenUsage || 0;

  for (const key in message.responses) {
    if (message.responses.hasOwnProperty(key)) {
      totalTokenUsage += message.responses[key]?.tokenUsage || 0;
    }
  }

  return totalTokenUsage;
}

// Function to calculate total token credit cost
export function calculateCreditCost(tokens: number, round = true): number {
  const totalCost = calculateCost(tokens);

  return convertToSubcurrency(totalCost, 100, round);
}
