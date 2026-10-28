import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const firestore = readFileSync("firestore.rules", "utf8");
const storage = readFileSync("storage.rules", "utf8");

describe("firestore rules", () => {
  it("freezes credit balances and server-only purchase grants", () => {
    expect(firestore).toContain("request.resource.data.credits == resource.data.credits");
    expect(firestore).toContain(
      "request.resource.data.totalCredits == resource.data.totalCredits"
    );
    expect(firestore).toContain("request.resource.data.APIKeys == resource.data.APIKeys");
    expect(firestore).toContain("match /billing/{document=**}");
    expect(firestore).toContain("match /body/{docId}");
    expect(firestore).toContain("allow read, write: if false");
  });
});

describe("storage rules", () => {
  it("keeps objects owner-scoped", () => {
    expect(storage).toContain("allow read, write: if isOwner(uid)");
    expect(storage).toContain("match /{allPaths=**}");
  });
});
