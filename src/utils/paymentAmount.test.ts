import { describe, expect, it } from "vitest";
import { CATALOG_AMOUNT_CENTS, isCatalogAmount } from "./paymentAmount";

describe("isCatalogAmount", () => {
  it("accepts only the displayed $99.99 purchase", () => {
    expect(isCatalogAmount(CATALOG_AMOUNT_CENTS)).toBe(true);
    expect(isCatalogAmount(100)).toBe(false);
    expect(isCatalogAmount(1)).toBe(false);
    expect(isCatalogAmount(0)).toBe(false);
  });
});
