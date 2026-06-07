import { describe, it, expect } from "vitest";
import { trimText, capitalize } from "./text";

describe("trimText", () => {
  it("leaves short text unchanged", () => {
    expect(trimText("hello")).toBe("hello");
  });

  it("truncates and appends an ellipsis past the limit", () => {
    expect(trimText("abcdef", 3)).toBe("abc...");
  });
});

describe("capitalize", () => {
  it("uppercases the first character", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("returns falsy input unchanged", () => {
    expect(capitalize("")).toBe("");
  });
});
