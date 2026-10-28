import { beforeEach, describe, expect, it, vi } from "vitest";

const constructEvent = vi.fn();
const grantCatalogCredits = vi.fn();

vi.mock("@/server/stripe", () => ({
  getStripe: () => ({
    webhooks: { constructEvent },
  }),
}));

vi.mock("@/firebase/creditLedger", () => ({
  grantCatalogCredits: (...args: unknown[]) => grantCatalogCredits(...args),
}));

import { POST } from "./route";

const request = (body: string, signature?: string) =>
  new Request("https://example.com/api/stripe/webhook", {
    method: "POST",
    headers: signature ? { "stripe-signature": signature } : {},
    body,
  });

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("Stripe webhook", () => {
  it("does nothing when the webhook secret is unset", async () => {
    const response = await POST(request("{}", "sig"));
    expect(response.status).toBe(503);
    expect(constructEvent).not.toHaveBeenCalled();
    expect(grantCatalogCredits).not.toHaveBeenCalled();
  });

  it("rejects a missing or invalid signature", async () => {
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
    const missing = await POST(request("{}"));
    expect(missing.status).toBe(400);

    constructEvent.mockImplementationOnce(() => {
      throw new Error("bad signature");
    });
    const invalid = await POST(request("{}", "sig"));
    expect(invalid.status).toBe(400);
    expect(grantCatalogCredits).not.toHaveBeenCalled();
  });

  it("grants catalog credits for a signed succeeded PaymentIntent", async () => {
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
    constructEvent.mockReturnValueOnce({
      type: "payment_intent.succeeded",
      data: {
        object: {
          id: "pi_signed",
          amount: 9999,
          metadata: { uid: "user-a" },
        },
      },
    });

    const response = await POST(request("{}", "sig"));
    expect(response.status).toBe(200);
    expect(grantCatalogCredits).toHaveBeenCalledWith("user-a", "pi_signed", 9999);
  });

  it("ignores a signed event for a non-catalog amount", async () => {
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
    constructEvent.mockReturnValueOnce({
      type: "payment_intent.succeeded",
      data: {
        object: {
          id: "pi_other",
          amount: 100,
          metadata: { uid: "user-a" },
        },
      },
    });

    const response = await POST(request("{}", "sig"));
    expect(response.status).toBe(200);
    expect(grantCatalogCredits).not.toHaveBeenCalled();
  });
});
