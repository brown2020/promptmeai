import { describe, expect, it } from "vitest";
import { truncateChatName } from "./chat";

describe("truncateChatName", () => {
  it("keeps the sidebar label short", () => {
    expect(truncateChatName("  hello  ")).toBe("hello");
    expect(truncateChatName("")).toBe("Default Chat Name");
    expect(truncateChatName("a".repeat(250))).toHaveLength(200);
  });
});
