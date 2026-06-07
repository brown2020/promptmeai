import { describe, it, expect } from "vitest";
import {
  convertToSubcurrency,
  subcurrencyToNumber,
  formatNumber,
} from "./number";

describe("convertToSubcurrency", () => {
  it("scales by 100 and rounds by default", () => {
    expect(convertToSubcurrency(10)).toBe(1000);
    expect(convertToSubcurrency(0.045)).toBe(5);
  });

  it("can skip rounding when asked", () => {
    expect(convertToSubcurrency(0.045, 100, false)).toBeCloseTo(4.5);
  });
});

describe("subcurrencyToNumber", () => {
  it("is the inverse of convertToSubcurrency for whole amounts", () => {
    expect(subcurrencyToNumber(1000)).toBe(10);
  });
});

describe("formatNumber", () => {
  it("formats integers with thousands separators", () => {
    expect(formatNumber(10_000)).toBe("10,000");
  });

  it("supports a currency symbol and decimals", () => {
    expect(formatNumber(1234.5, 2, "$")).toBe("$1,234.50");
  });
});
