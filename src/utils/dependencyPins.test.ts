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

  it("keeps the patched minimatch and glob overrides", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));

    expect(pkg.overrides.minimatch).toBe("^11.0.4");
    expect(pkg.overrides.glob).toBe("^14.0.3");
    expect(pkg.overrides["@firebase/firestore"]["@grpc/grpc-js"]).toBe("^1.14.7");
    expect(lock.packages["node_modules/minimatch"].version).toBe("11.0.4");
    expect(lock.packages["node_modules/glob"].version).toBe("14.0.3");
    expect(lock.packages["node_modules/@grpc/grpc-js"].version).toBe("1.14.7");
  });
});
