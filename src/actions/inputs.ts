import { z } from "zod";
import type { ModelMessage } from "ai";
import { MODEL_CONFIG, type ModelName } from "@/constants/modelNames";
import type { APIKeys, UsageMode } from "@/zustand/useProfileStore";

const CREDITS_MODE = "CREDITS" satisfies `${UsageMode.Credits}`;

/** Thrown when a server action receives a payload it does not accept. */
export class InvalidActionInput extends Error {
  constructor(action: string) {
    super(`Invalid input for ${action}`);
    this.name = "InvalidActionInput";
  }
}

const MAX_MESSAGES = 200;
const MAX_MESSAGE_CHARS = 100_000;

const textPart = z.object({ type: z.literal("text"), text: z.string() });

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.union([
    z.string().max(MAX_MESSAGE_CHARS),
    z.array(textPart).max(50),
  ]),
});

const modelNameSchema = z.enum(
  Object.keys(MODEL_CONFIG) as [ModelName, ...ModelName[]]
);

const apiKeysSchema = z.object({
  openAi: z.string().max(500).default(""),
  anthropic: z.string().max(500).default(""),
  googleGenerativeAi: z.string().max(500).default(""),
});

const requestIdSchema = z.uuid();

const conversationSchema = z.object({
  messages: z.array(messageSchema).min(1).max(MAX_MESSAGES),
  modelName: modelNameSchema,
  apiKeys: z.union([z.literal(CREDITS_MODE), apiKeysSchema]),
  requestId: requestIdSchema.optional(),
});

export type ConversationInput = {
  messages: ModelMessage[];
  modelName: ModelName;
  apiKeys: APIKeys | UsageMode.Credits;
  requestId?: string;
};

export const parseConversationInput = (
  messages: unknown,
  modelName: unknown,
  apiKeys: unknown,
  requestId?: unknown
): ConversationInput => {
  const result = conversationSchema.safeParse({ messages, modelName, apiKeys, requestId });
  if (!result.success) throw new InvalidActionInput("continueConversation");
  return result.data as ConversationInput;
};

export const parseRequestId = (value: unknown): string => {
  const result = requestIdSchema.safeParse(value);
  if (!result.success) throw new InvalidActionInput("requestId");
  return result.data;
};

const paymentIntentIdSchema = z
  .string()
  .regex(/^pi_[A-Za-z0-9_]{1,250}$/);

export const parsePaymentIntentId = (value: unknown): string => {
  const result = paymentIntentIdSchema.safeParse(value);
  if (!result.success) throw new InvalidActionInput("paymentIntentId");
  return result.data;
};

export const parseAmountCents = (value: unknown): number => {
  const result = z.number().int().positive().safeParse(value);
  if (!result.success) throw new InvalidActionInput("amount");
  return result.data;
};
