import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config.mjs";
import { effectiveSources, parseCsp, sourceAllowsUrl } from "./csp";

const DOCUMENT = "https://promptmeai-git-dev-ignitechannel.vercel.app/";
const GTAG = "https://www.googletagmanager.com/gtag/js?l=dataLayer&id=G-5FYY8YVDZ5";

const PREEXISTING_WILDCARDS = new Set([
  "https://*.googleapis.com",
  "https://*.firebaseio.com",
  "wss://*.firebaseio.com",
  "https://*.firebaseapp.com",
]);

async function pageCsp(): Promise<string> {
  const groups = await nextConfig.headers();
  expect(groups.map((group) => group.source)).toEqual(["/:path*"]);
  const header = groups[0]?.headers.find((item) => item.key === "Content-Security-Policy");
  if (!header) throw new Error("Content-Security-Policy header is missing");
  return header.value;
}

function allows(
  policy: string,
  kind: "script" | "connect" | "frame" | "img",
  url: string
): boolean {
  return sourceAllowsUrl(effectiveSources(parseCsp(policy), kind), url, DOCUMENT);
}

describe("csp host matching", () => {
  it("matches an exact https host and a single-label wildcard, not lookalikes", () => {
    const sources = ["https://www.googletagmanager.com", "https://*.googleapis.com"];
    expect(sourceAllowsUrl(sources, GTAG, DOCUMENT)).toBe(true);
    expect(
      sourceAllowsUrl(sources, "https://identitytoolkit.googleapis.com/v1/accounts:signUp", DOCUMENT)
    ).toBe(true);
    expect(
      sourceAllowsUrl(sources, "https://securetoken.googleapis.com/v1/token", DOCUMENT)
    ).toBe(true);
    expect(sourceAllowsUrl(sources, "http://www.googletagmanager.com/gtag/js", DOCUMENT)).toBe(
      false
    );
    expect(
      sourceAllowsUrl(sources, "https://www.googletagmanager.com.evil.example/gtag/js", DOCUMENT)
    ).toBe(false);
    expect(sourceAllowsUrl(sources, "https://evil.googletagmanager.com/gtag/js", DOCUMENT)).toBe(
      false
    );
    expect(sourceAllowsUrl(sources, "https://googleapis.com/v1/token", DOCUMENT)).toBe(false);
    expect(sourceAllowsUrl(sources, "https://evil.googleapis.com.attacker.com/v1", DOCUMENT)).toBe(
      false
    );
  });
});

describe("page content security policy", () => {
  it("allows the Firebase Analytics gtag script and its collect hosts", async () => {
    const policy = await pageCsp();
    expect(allows(policy, "script", GTAG)).toBe(true);
    expect(allows(policy, "connect", "https://www.google-analytics.com/g/collect")).toBe(true);
    expect(allows(policy, "connect", "https://region1.google-analytics.com/g/collect")).toBe(true);
    expect(allows(policy, "connect", "https://analytics.google.com/g/collect")).toBe(true);
    expect(allows(policy, "connect", GTAG)).toBe(true);
  });

  it("keeps auth, Stripe, and App Check origins and rejects unrelated ones", async () => {
    const policy = await pageCsp();
    expect(allows(policy, "script", "https://js.stripe.com/v3/")).toBe(true);
    expect(allows(policy, "script", "https://www.google.com/recaptcha/api.js")).toBe(true);
    expect(allows(policy, "script", "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js")).toBe(
      true
    );
    expect(allows(policy, "script", "https://www.recaptcha.net/recaptcha/api.js")).toBe(true);
    expect(allows(policy, "connect", "https://api.stripe.com/v1/payment_intents")).toBe(true);
    expect(allows(policy, "connect", "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword")).toBe(
      true
    );
    expect(allows(policy, "connect", "https://securetoken.googleapis.com/v1/token")).toBe(true);
    expect(allows(policy, "connect", "https://firestore.googleapis.com/v1/projects/promptmeai")).toBe(
      true
    );
    expect(allows(policy, "frame", "https://accounts.google.com/o/oauth2/v2/auth")).toBe(true);
    expect(allows(policy, "frame", "https://js.stripe.com/v3/")).toBe(true);
    expect(allows(policy, "frame", "https://promptmeai.firebaseapp.com/__/auth/handler")).toBe(true);

    expect(allows(policy, "script", "https://vercel.live/feedback.js")).toBe(false);
    expect(allows(policy, "connect", "https://vercel.live/feedback.js")).toBe(false);
    expect(allows(policy, "frame", "https://vercel.live/")).toBe(false);
    expect(allows(policy, "script", "https://evil.example/gtag.js")).toBe(false);
    expect(allows(policy, "connect", "https://evil.example/g/collect")).toBe(false);
    expect(allows(policy, "script", "http://www.googletagmanager.com/gtag/js")).toBe(false);
    expect(allows(policy, "script", "https://www.google-analytics.com/analytics.js")).toBe(false);
    expect(allows(policy, "frame", "https://www.googletagmanager.com/")).toBe(false);
    expect(allows(policy, "connect", "https://stats.g.doubleclick.net/g/collect")).toBe(false);
    expect(allows(policy, "img", "https://www.google-analytics.com/g/collect")).toBe(false);
  });

  it("does not add scheme or host wildcards, unsafe keywords, or a CSP bypass", async () => {
    const directives = parseCsp(await pageCsp());
    const wildcards = [...directives.values()]
      .flat()
      .filter((source) => source.includes("*"));
    expect(new Set(wildcards)).toEqual(PREEXISTING_WILDCARDS);
    expect(directives.get("script-src")).toContain("'unsafe-inline'");
    expect(directives.get("script-src")).toContain("'unsafe-eval'");
    expect(directives.get("style-src")).toEqual(["'self'", "'unsafe-inline'"]);
    expect(directives.get("default-src")).toEqual(["'self'"]);
    expect(directives.get("object-src")).toEqual(["'none'"]);
    expect(directives.get("frame-ancestors")).toEqual(["'none'"]);
    expect(directives.get("base-uri")).toEqual(["'self'"]);
    expect(directives.get("form-action")).toEqual(["'self'"]);
    expect(directives.has("script-src-elem")).toBe(false);
    for (const [name, sources] of directives) {
      if (name === "script-src" || name === "style-src") continue;
      expect(sources).not.toContain("'unsafe-inline'");
      expect(sources).not.toContain("'unsafe-eval'");
    }
  });
});
