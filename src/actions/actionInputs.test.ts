import { beforeEach, describe, expect, it, vi } from "vitest";

const calls = vi.hoisted(() => ({
  verifyAuth: vi.fn(async () => "user-a"),
  hasCreditsAvailable: vi.fn(async () => true),
  createOpenAI: vi.fn(),
  retrieve: vi.fn(),
  grantCatalogCredits: vi.fn(),
  watchCancellation: vi.fn((_uid: string, _id: string, _onCancel: () => void) => () => undefined),
  requestCancellation: vi.fn(async () => undefined),
  streamText: vi.fn((_options: { abortSignal: AbortSignal }) => ({
    textStream: new ReadableStream<string>({ start: (c) => c.close() }),
  })),
}));

vi.mock("@/firebase/firebaseAdmin", () => ({ verifyAuth: calls.verifyAuth }));
vi.mock("@/firebase/creditLedger", () => ({
  ensureUserProfile: vi.fn(async () => undefined),
  loadAuthIdentity: vi.fn(async () => ({
    email: "",
    displayName: "",
    photoUrl: "",
    emailVerified: true,
  })),
  reserveCredits: calls.hasCreditsAvailable,
  refundCredits: vi.fn(async () => undefined),
  grantCatalogCredits: calls.grantCatalogCredits,
}));
vi.mock("@/zustand/useProfileStore", () => ({
  UsageMode: { Credits: "CREDITS", ApiKeys: "API_KEYS" },
}));
vi.mock("@ai-sdk/openai", () => ({ createOpenAI: calls.createOpenAI }));
vi.mock("@/firebase/generationControl", () => ({
  watchCancellation: calls.watchCancellation,
  requestCancellation: calls.requestCancellation,
}));
vi.mock("ai", () => ({ streamText: calls.streamText }));
vi.mock("@ai-sdk/rsc", () => ({ createStreamableValue: () => ({ value: {} }) }));
vi.mock("stripe", () => ({
  default: class {
    paymentIntents = { retrieve: calls.retrieve, create: vi.fn() };
  },
}));

import { cancelGeneration, continueConversation } from "./generateActions";
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
    [
      "an oversized text part",
      [{ role: "user", content: [{ type: "text", text: "a".repeat(100_001) }] }],
      "gpt-6.1-sol",
      UsageMode.Credits,
    ],
  ])("rejects %s before credits or a provider client", async (_label, messages, model, keys) => {
    await expect(
      continueConversation(messages as ModelMessage[], model as ModelName, keys as UsageMode)
    ).rejects.toThrow("Invalid input for continueConversation");
    expect(calls.verifyAuth).toHaveBeenCalledOnce();
    expect(calls.hasCreditsAvailable).not.toHaveBeenCalled();
    expect(calls.createOpenAI).not.toHaveBeenCalled();
  });

  it("rejects an unauthenticated caller before parsing or charging", async () => {
    calls.verifyAuth.mockRejectedValueOnce(new Error("Unauthorized"));
    await expect(
      continueConversation(prompt, "gpt-6.1-sol", UsageMode.Credits)
    ).rejects.toThrow("Unauthorized");
    expect(calls.hasCreditsAvailable).not.toHaveBeenCalled();
    expect(calls.createOpenAI).not.toHaveBeenCalled();
  });
});

describe("continueConversation credit gate", () => {
  it("returns insufficient_credits without building a provider client", async () => {
    calls.hasCreditsAvailable.mockResolvedValueOnce(false);
    await expect(
      continueConversation(prompt, "gpt-6.1-sol", UsageMode.Credits)
    ).resolves.toEqual({ status: "insufficient_credits" });
    expect(calls.createOpenAI).not.toHaveBeenCalled();
  });
});

describe("stopping a generation", () => {
  const requestId = "0b6c8e0e-6a65-4d8f-9a37-3c2f1f0f3b11";

  it("aborts the provider stream when the user's stop arrives", async () => {
    calls.createOpenAI.mockReturnValueOnce(() => ({}));
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    await continueConversation(prompt, "gpt-6.1-sol", UsageMode.Credits, requestId);
    expect(calls.watchCancellation).toHaveBeenCalledWith("user-a", requestId, expect.any(Function));
    const signal = calls.streamText.mock.calls[0][0].abortSignal;
    expect(signal.aborted).toBe(false);
    const onCancel = calls.watchCancellation.mock.calls[0][2];
    onCancel();
    expect(signal.aborted).toBe(true);
    vi.unstubAllEnvs();
  });

  it("rejects a malformed request id before any work", async () => {
    await expect(
      continueConversation(prompt, "gpt-6.1-sol", UsageMode.Credits, "../other-user")
    ).rejects.toThrow("Invalid input for continueConversation");
    await expect(cancelGeneration("not-a-uuid")).rejects.toThrow("Invalid input for requestId");
    expect(calls.requestCancellation).not.toHaveBeenCalled();
  });

  it("records the stop for the signed-in caller only", async () => {
    await cancelGeneration(requestId);
    expect(calls.verifyAuth).toHaveBeenCalledOnce();
    expect(calls.requestCancellation).toHaveBeenCalledWith("user-a", requestId);
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
