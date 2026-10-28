import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("firebase-admin jose pin", () => {
  it("keeps jwks-rsa on jose 5.10.0 so firebase-admin can require it", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));

    expect(pkg.dependencies["firebase-admin"]).toMatch(/^\^14\./);
    expect(pkg.overrides["jwks-rsa"]).toEqual({ jose: "5.10.0" });
    expect(lock.packages["node_modules/jwks-rsa/node_modules/jose"].version).toBe(
      "5.10.0"
    );
    expect(lock.packages["node_modules/jose"]).toBeUndefined();
  });
});
