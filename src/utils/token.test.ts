import { describe, it, expect } from "vitest";
import {
  countTokens,
  calculateCreditCost,
  calculateTotalTokenUsage,
} from "./token";
import type { Message } from "@/zustand/useChatStore";

describe("countTokens", () => {
  it("returns 0 for empty or non-string input", () => {
    expect(countTokens("")).toBe(0);
    // @ts-expect-error exercising the runtime guard for bad input
    expect(countTokens(null)).toBe(0);
    // @ts-expect-error exercising the runtime guard for bad input
    expect(countTokens(123)).toBe(0);
  });

  it("approximates ~4 characters per token", () => {
    expect(countTokens("aaaa")).toBe(1);
    expect(countTokens("aaaaa")).toBe(2);
  });

  it("trims surrounding whitespace before counting", () => {
    expect(countTokens("  aaaa  ")).toBe(1);
  });

  it("caps extremely long input instead of counting all of it", () => {
    const huge = "a".repeat(200_000);
    // 100_000 char cap / 4 chars-per-token = 25_000
    expect(countTokens(huge)).toBe(25_000);
  });
});

describe("calculateCreditCost", () => {
  it("converts tokens to credits at the flat rate", () => {
    // 1000 tokens * ($0.04 / 1000) = $0.04 -> 4 credits (subcurrency)
    expect(calculateCreditCost(1000)).toBe(4);
    expect(calculateCreditCost(0)).toBe(0);
  });
});

describe("calculateTotalTokenUsage", () => {
  it("sums the user message and all model responses", () => {
    const message = {
      userMessage: { tokenUsage: 5 },
      responses: {
        modelA: { tokenUsage: 3 },
        modelB: { tokenUsage: 7 },
      },
    } as unknown as Message;

    expect(calculateTotalTokenUsage(message)).toBe(15);
  });

  it("treats missing token usage as zero", () => {
    const message = {
      userMessage: {},
      responses: { modelA: {} },
    } as unknown as Message;

    expect(calculateTotalTokenUsage(message)).toBe(0);
  });
});
