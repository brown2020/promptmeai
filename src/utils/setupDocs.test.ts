import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("setup docs", () => {
  it("names the auth cookie default the server uses", () => {
    expect(readFileSync(".env.example", "utf8")).toContain(
      "NEXT_PUBLIC_COOKIE_NAME=authToken"
    );
    const readme = readFileSync("README.md", "utf8");
    expect(readme).toContain("NEXT_PUBLIC_COOKIE_NAME=authToken");
    expect(readme).not.toContain("promptme_auth");
    expect(JSON.parse(readFileSync("firebase.json", "utf8"))).toEqual({
      firestore: { rules: "firestore.rules" },
      storage: { rules: "storage.rules" },
    });
    expect(readme).toContain('"rules": "firestore.rules"');
    expect(readme).not.toContain("storage:rules");
  });
});
