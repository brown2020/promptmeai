"use client";

import GreenWhiteLayout from "@/layouts/GreenWhiteLayout";
import { convertToSubcurrency } from "@/utils/number";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentCheckout from "./sections/PaymentCheckout";

if (process.env.NEXT_PUBLIC_STRIPE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const PaymentAttemptScreen = () => {
  const amount = 99.99;

  return (
    <GreenWhiteLayout>
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "usd",
        }}
      >
        <PaymentCheckout amount={amount} />
      </Elements>
    </GreenWhiteLayout>
  );
};

export default PaymentAttemptScreen;
