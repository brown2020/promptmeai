import { describe, expect, it } from "vitest";
import { MODEL_CONFIG } from "@/constants/modelNames";

describe("comparison model ids", () => {
  it("matches the four vendor ids confirmed on 2026-09-21", () => {
    expect(
      Object.values(MODEL_CONFIG).map((config) => config.modelId)
    ).toEqual([
      "gpt-5.5",
      "claude-sonnet-4-6",
      "models/gemini-3.5-flash",
      "mistral-small-latest",
    ]);
  });
});
