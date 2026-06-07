import { describe, it, expect } from "vitest";
import { areObjectsEqual, isObjectEmpty } from "./object";

describe("isObjectEmpty", () => {
  it("returns true only when every value is an empty string", () => {
    expect(isObjectEmpty({ a: "", b: "" })).toBe(true);
    expect(isObjectEmpty({ a: "", b: "x" })).toBe(false);
  });

  it("treats an empty object as empty", () => {
    expect(isObjectEmpty({})).toBe(true);
  });
});

describe("areObjectsEqual", () => {
  it("compares by serialized value", () => {
    expect(areObjectsEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    expect(areObjectsEqual({ a: 1 }, { a: 2 })).toBe(false);
  });
});
