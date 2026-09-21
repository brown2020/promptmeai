"use server";

import Stripe from "stripe";
import { verifyAuth } from "@/firebase/firebaseAdmin";
import { grantCatalogCredits } from "@/firebase/creditLedger";
import { isCatalogAmount } from "@/utils/paymentAmount";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function createPaymentIntent(amount: number) {
  const uid = await verifyAuth();

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

export async function validatePaymentIntent(paymentIntentId: string) {
  await verifyAuth();

  if (!paymentIntentId || typeof paymentIntentId !== "string") {
    throw new Error("Invalid payment intent ID");
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        created: paymentIntent.created,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret,
        currency: paymentIntent.currency,
        description: paymentIntent.description,
      };
    } else {
      throw new Error("Payment was not successful");
    }
  } catch (error) {
    console.error("Error validating payment intent:", error);
    throw new Error("Failed to validate payment intent");
  }
}

export async function grantCatalogPurchase(paymentIntentId: string) {
  const uid = await verifyAuth();

  if (!paymentIntentId || typeof paymentIntentId !== "string") {
    throw new Error("Invalid payment intent ID");
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    throw new Error("Payment was not successful");
  }

  if (paymentIntent.metadata.uid !== uid) {
    throw new Error("Payment does not belong to this account");
  }

  return grantCatalogCredits(uid, paymentIntent.id, paymentIntent.amount);
}
