import { describe, expect, it } from "vitest";
import { paths } from "@/firebase/paths";

const segmentCount = (path: string) => path.split("/").filter(Boolean).length;

/** Helpers passed to `doc()`. An odd count is a collection and Firestore rejects it. */
const documentPaths: Record<string, string> = {
  user: paths.user("uid"),
  userProfile: paths.userProfile("uid"),
  userGeneration: paths.userGeneration("uid", "req"),
  userGrant: paths.userGrant("uid", "pi_123"),
  userChat: paths.userChat("uid", "chat"),
  userChatTranscript: paths.userChatTranscript("uid", "chat"),
};

const collectionPaths: Record<string, string> = {
  userPayments: paths.userPayments("uid"),
  userGenerations: paths.userGenerations("uid"),
  userChats: paths.userChats("uid"),
};

describe("firestore path helpers", () => {
  it("classifies every helper as a document or a collection", () => {
    expect(
      [...Object.keys(documentPaths), ...Object.keys(collectionPaths)].sort()
    ).toEqual(Object.keys(paths).sort());
  });

  it("gives every document helper an even number of segments", () => {
    expect(
      Object.entries(documentPaths).map(([name, path]) => [
        name,
        segmentCount(path) % 2,
      ])
    ).toEqual(Object.keys(documentPaths).map((name) => [name, 0]));
  });

  it("keys a catalog grant on the payment intent", () => {
    expect(paths.userGrant("uid", "pi_123")).toBe(
      "users/uid/billingGrants/pi_123"
    );
  });
});
