import { grantCatalogCredits } from "@/firebase/creditLedger";
import { getStripe } from "@/server/stripe";
import { isCatalogAmount } from "@/utils/paymentAmount";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Grants catalog credits when Stripe reports a succeeded PaymentIntent.
 * Returns 503 when STRIPE_WEBHOOK_SECRET is unset so a missing secret
 * cannot accept unsigned events.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return new Response("Stripe webhook is not configured", { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      await request.text(),
      signature,
      secret
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type !== "payment_intent.succeeded") {
    return new Response("ok");
  }

  const intent = event.data.object;
  const uid = intent.metadata?.uid;
  if (!uid || !isCatalogAmount(intent.amount)) {
    return new Response("ignored");
  }

  try {
    await grantCatalogCredits(uid, intent.id, intent.amount);
  } catch (error) {
    console.error(
      "Webhook grant failed:",
      error instanceof Error ? error.message : "unknown"
    );
    return new Response("Grant failed", { status: 500 });
  }

  return new Response("ok");
}
