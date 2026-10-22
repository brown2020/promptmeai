"use server";

import Stripe from "stripe";
import { verifyAuth } from "@/firebase/firebaseAdmin";
import { grantCatalogCredits } from "@/firebase/creditLedger";
import { isCatalogAmount } from "@/utils/paymentAmount";
import { parseAmountCents, parsePaymentIntentId } from "./inputs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function createPaymentIntent(rawAmount: number) {
  const uid = await verifyAuth();
  const amount = parseAmountCents(rawAmount);

  if (!isCatalogAmount(amount)) {
    throw new Error("Invalid payment amount");
  }

  const product = process.env.NEXT_PUBLIC_STRIPE_PRODUCT_NAME;

  try {
    if (!product) throw new Error("Stripe product name is not defined");

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: { product, uid },
      description: `Payment for product ${product}`,
    });

    return paymentIntent.client_secret;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw new Error("Failed to create payment intent");
  }
}

export async function grantCatalogPurchase(rawPaymentIntentId: string) {
  const uid = await verifyAuth();
  const paymentIntentId = parsePaymentIntentId(rawPaymentIntentId);

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    throw new Error("Payment was not successful");
  }

  if (paymentIntent.metadata.uid !== uid) {
    throw new Error("Payment does not belong to this account");
  }

  return grantCatalogCredits(uid, paymentIntent.id, paymentIntent.amount);
}
