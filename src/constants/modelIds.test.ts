import { describe, expect, it } from "vitest";
import {
  MODEL_CONFIG,
  responseEntriesForDisplay,
} from "@/constants/modelNames";

describe("comparison model ids", () => {
  it("matches the three vendor ids confirmed on 2026-10-21", () => {
    expect(
      Object.values(MODEL_CONFIG).map((config) => config.modelId)
    ).toEqual(["gpt-6.1-sol", "claude-opus-5-5", "gemini-4-argon"]);
  });

  it("has no Mistral provider", () => {
    expect(
      Object.values(MODEL_CONFIG).map((config) => config.provider)
    ).toEqual(["openai", "anthropic", "google"]);
  });
});

describe("saved response display", () => {
  it("lists current models first, then labels responses from earlier lineups", () => {
    expect(
      responseEntriesForDisplay([
        "mistral-small-latest",
        "gemini-4-argon",
        "gpt-5.5",
        "gpt-6.1-sol",
        "unknown-model",
      ])
    ).toEqual([
      { key: "gpt-6.1-sol", label: "GPT-6.1 Sol" },
      { key: "gemini-4-argon", label: "Gemini 4 Argon" },
      { key: "mistral-small-latest", label: "Mistral Small" },
      { key: "gpt-5.5", label: "GPT-5.5" },
      { key: "unknown-model", label: "unknown-model" },
    ]);
  });
});
