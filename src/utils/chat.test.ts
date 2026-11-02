import { describe, expect, it } from "vitest";
import { subDays } from "date-fns";
import type { ChatDetail } from "@/types/chat";
import {
  deleteChatById,
  groupChatByDate,
  moveChatById,
  searchChatByName,
  sortChatByDateDesc,
  truncateChatName,
} from "./chat";

const chat = (id: string, name: string, when: Date): ChatDetail =>
  ({
    id,
    name,
    timestamp: { toDate: () => when },
  }) as ChatDetail;

describe("truncateChatName", () => {
  it("keeps the sidebar label short", () => {
    expect(truncateChatName("  hello  ")).toBe("hello");
    expect(truncateChatName("")).toBe("Default Chat Name");
    expect(truncateChatName("a".repeat(250))).toHaveLength(200);
  });
});

describe("chat history", () => {
  const now = new Date();
  const chats = [
    chat("today", "Compare tokenizers", now),
    chat("yesterday", "Yesterday notes", subDays(now, 1)),
    chat("week", "Last week prompt", subDays(now, 3)),
    chat("month", "Older prompt", subDays(now, 10)),
    chat("archive", "Archive prompt", subDays(now, 40)),
  ];

  it("searches saved comparison names without case", () => {
    expect(searchChatByName(chats, "TOKEN").map((item) => item.id)).toEqual([
      "today",
    ]);
    expect(searchChatByName(chats, "missing")).toEqual([]);
  });

  it("sorts the sidebar newest first", () => {
    expect(sortChatByDateDesc([...chats].reverse()).map((item) => item.id)).toEqual([
      "today",
      "yesterday",
      "week",
      "month",
      "archive",
    ]);
  });

  it("groups history into the sidebar date buckets", () => {
    const groups = groupChatByDate(chats);
    expect(groups.today.map((item) => item.id)).toEqual(["today"]);
    expect(groups.yesterday.map((item) => item.id)).toEqual(["yesterday"]);
    expect(groups.previous7Days.map((item) => item.id)).toEqual(["week"]);
    expect(groups.previous30Days.map((item) => item.id)).toEqual(["month"]);
    const archiveLabel = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(subDays(now, 40));
    expect(groups.previousMonths[archiveLabel].map((item) => item.id)).toEqual([
      "archive",
    ]);
  });

  it("pins a chat by moving it and leaves a missing id in place", () => {
    const pinned: ChatDetail[] = [];
    const moved = moveChatById("today", chats, pinned);
    expect(moved.notFound).toBe(false);
    expect(moved.result.newFromArray.map((item) => item.id)).not.toContain("today");
    expect(moved.result.newToArray[0]?.id).toBe("today");
    expect(moved.result.newToArray[0]?.timestamp.toDate()).toBeInstanceOf(Date);

    const missing = moveChatById("nope", chats, pinned);
    expect(missing.notFound).toBe(true);
    expect(missing.result.newFromArray).toBe(chats);
    expect(missing.result.newToArray).toBe(pinned);
  });

  it("deletes one saved comparison", () => {
    expect(deleteChatById("week", chats).map((item) => item.id)).toEqual([
      "today",
      "yesterday",
      "month",
      "archive",
    ]);
  });
});
