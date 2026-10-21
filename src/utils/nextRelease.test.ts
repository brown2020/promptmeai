import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const atLeast = (version: string, minimum: [number, number, number]) => {
  const parts = version.split(".").map(Number);
  for (let index = 0; index < minimum.length; index += 1) {
    const value = parts[index] ?? 0;
    if (value > minimum[index]) return true;
    if (value < minimum[index]) return false;
  }
  return true;
};

describe("Next.js release", () => {
  it("resolves a 16.4.1 or newer release that includes the October 2026 security fixes", () => {
    const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
    const installed = lock.packages["node_modules/next"].version as string;
    expect(atLeast(installed, [16, 4, 1])).toBe(true);
  });
});
