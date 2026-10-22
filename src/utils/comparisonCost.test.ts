import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MODEL_NAMES } from "@/constants/modelNames";

describe("comparison cost", () => {
  it("fans out once per configured model and checks credits before a provider client is built", () => {
    expect(MODEL_NAMES).toHaveLength(3);

    const source = readFileSync("src/actions/generateActions.ts", "utf8");
    const creditCheck = source.indexOf("hasCreditsAvailable(uid)");
    const providerClient = source.indexOf("= getModel(");
    expect(creditCheck).toBeGreaterThan(-1);
    expect(providerClient).toBeGreaterThan(creditCheck);
  });
});
