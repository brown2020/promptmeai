import Stripe from "stripe";

/** Stripe API client. Missing secret fails the call instead of crashing import. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error("Stripe is not configured");
  }
  return new Stripe(key);
}
