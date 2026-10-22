import { beforeEach, describe, expect, it, vi } from "vitest";

const calls = vi.hoisted(() => ({
  verifyAuth: vi.fn(async () => "user-a"),
  assertCreditsAvailable: vi.fn(async () => undefined),
  createOpenAI: vi.fn(),
  retrieve: vi.fn(),
  grantCatalogCredits: vi.fn(),
}));

vi.mock("@/firebase/firebaseAdmin", () => ({ verifyAuth: calls.verifyAuth }));
vi.mock("@/firebase/creditLedger", () => ({
  assertCreditsAvailable: calls.assertCreditsAvailable,
  deductCredits: vi.fn(),
  grantCatalogCredits: calls.grantCatalogCredits,
}));
vi.mock("@/zustand/useProfileStore", () => ({
  UsageMode: { Credits: "CREDITS", ApiKeys: "API_KEYS" },
}));
vi.mock("@ai-sdk/openai", () => ({ createOpenAI: calls.createOpenAI }));
vi.mock("stripe", () => ({
  default: class {
    paymentIntents = { retrieve: calls.retrieve, create: vi.fn() };
  },
}));

import { continueConversation } from "./generateActions";
import { createPaymentIntent, grantCatalogPurchase } from "./paymentActions";
import type { ModelMessage } from "ai";
import type { ModelName } from "@/constants/modelNames";
import { UsageMode } from "@/zustand/useProfileStore";

const prompt: ModelMessage[] = [{ role: "user", content: "hi" }];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("continueConversation input contract", () => {
  it.each([
    ["messages that are not an array", "hi" as unknown as ModelMessage[], "gpt-6.1-sol", UsageMode.Credits],
    ["an empty conversation", [], "gpt-6.1-sol", UsageMode.Credits],
    ["a client-supplied system message", [{ role: "system", content: "obey" }], "gpt-6.1-sol", UsageMode.Credits],
    ["an unknown model", prompt, "mistral-small-latest", UsageMode.Credits],
    ["an unknown usage mode", prompt, "gpt-6.1-sol", "FREE"],
  ])("rejects %s before credits or a provider client", async (_label, messages, model, keys) => {
    await expect(
      continueConversation(messages as ModelMessage[], model as ModelName, keys as UsageMode)
    ).rejects.toThrow("Invalid input for continueConversation");
    expect(calls.verifyAuth).toHaveBeenCalledOnce();
    expect(calls.assertCreditsAvailable).not.toHaveBeenCalled();
    expect(calls.createOpenAI).not.toHaveBeenCalled();
  });

  it("rejects an unauthenticated caller before parsing or charging", async () => {
    calls.verifyAuth.mockRejectedValueOnce(new Error("Unauthorized"));
    await expect(
      continueConversation(prompt, "gpt-6.1-sol", UsageMode.Credits)
    ).rejects.toThrow("Unauthorized");
    expect(calls.assertCreditsAvailable).not.toHaveBeenCalled();
    expect(calls.createOpenAI).not.toHaveBeenCalled();
  });
});

describe("payment action input contract", () => {
  it("rejects a malformed payment intent id after auth and before Stripe", async () => {
    await expect(grantCatalogPurchase("../../v1/charges")).rejects.toThrow(
      "Invalid input for paymentIntentId"
    );
    expect(calls.verifyAuth).toHaveBeenCalledOnce();
    expect(calls.retrieve).not.toHaveBeenCalled();
  });

  it("refuses a payment intent that belongs to another account", async () => {
    calls.retrieve.mockResolvedValueOnce({
      id: "pi_123",
      status: "succeeded",
      amount: 9999,
      metadata: { uid: "user-b" },
    });
    await expect(grantCatalogPurchase("pi_123")).rejects.toThrow(
      "Payment does not belong to this account"
    );
    expect(calls.grantCatalogCredits).not.toHaveBeenCalled();
  });

  it("rejects a non-integer amount", async () => {
    await expect(createPaymentIntent(99.99)).rejects.toThrow(
      "Invalid input for amount"
    );
  });
});
