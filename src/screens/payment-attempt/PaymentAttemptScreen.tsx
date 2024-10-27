"use client";

import GreenWhiteLayout from "@/layouts/GreenWhiteLayout";
import { convertToSubcurrency } from "@/utils/number";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentCheckout from "./sections/PaymentCheckout";
import { useTheme } from "next-themes";

if (process.env.NEXT_PUBLIC_STRIPE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const PaymentAttemptScreen = () => {
  const { theme } = useTheme();

  const amount = 99.99;

  return (
    <GreenWhiteLayout>
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "usd",
          appearance: {
            theme: theme === "dark" ? "night" : "stripe",
          },
        }}
      >
        <PaymentCheckout amount={amount} />
      </Elements>
    </GreenWhiteLayout>
  );
};

export default PaymentAttemptScreen;
