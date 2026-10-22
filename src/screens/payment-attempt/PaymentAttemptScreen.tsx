"use client";

import ClientOnly from "@/components/ClientOnly";
import GreenWhiteLayout from "@/layouts/GreenWhiteLayout";
import { convertToSubcurrency } from "@/utils/number";
import { usePlatform } from "@/zustand/usePlatformStore";

import { Elements } from "@stripe/react-stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import PaymentCheckout from "./sections/PaymentCheckout";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

if (process.env.NEXT_PUBLIC_STRIPE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_KEY is not defined");
}

const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY;
let stripePromise: Promise<Stripe | null> | undefined;
const getStripe = () => (stripePromise ??= loadStripe(STRIPE_KEY));

const AMOUNT = 99.99;

/** Credits can't be bought inside the iOS app, so the app is sent to Settings instead of Stripe. */
const PaymentAttemptScreen = () => (
  <ClientOnly>
    <PaymentAttemptForPlatform />
  </ClientOnly>
);

const PaymentAttemptForPlatform = () => {
  const { isRNWebView, isInitialized } = usePlatform();
  const router = useRouter();

  useEffect(() => {
    if (isRNWebView) router.replace("/settings");
  }, [isRNWebView, router]);

  return isInitialized && !isRNWebView ? <StripeCheckout /> : null;
};

const StripeCheckout = () => {
  const { resolvedTheme } = useTheme();

  return (
    <GreenWhiteLayout>
      <Elements
        stripe={getStripe()}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(AMOUNT),
          currency: "usd",
          appearance: {
            theme: resolvedTheme === "dark" ? "night" : "stripe",
          },
        }}
      >
        <PaymentCheckout amount={AMOUNT} />
      </Elements>
    </GreenWhiteLayout>
  );
};

export default PaymentAttemptScreen;
