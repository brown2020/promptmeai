"use client";

import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

import { useEffect, useState } from "react";
import { createPaymentIntent } from "@/actions/paymentActions";
import { convertToSubcurrency } from "@/utils/number";
import Spinner from "@/components/Spinner";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type PaymentCheckoutProps = { amount: number };

const PaymentCheckout = ({ amount }: PaymentCheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const priceLabel = usdFormatter.format(amount);

  useEffect(() => {
    let cancelled = false;
    createPaymentIntent(convertToSubcurrency(amount))
      .then((secret) => {
        if (!cancelled && secret) setClientSecret(secret);
      })
      .catch(() => {
        if (!cancelled) {
          setErrorMessage("Failed to initialize payment. Please try again.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [amount, attempt]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message || "Payment failed");
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?amount=${amount}`,
        },
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed");
      }
    } catch {
      setErrorMessage("Payment validation failed. Please try again.");
      console.warn("[payments] validation-failed");
    } finally {
      setLoading(false);
    }
  };

  if (!clientSecret && errorMessage) {
    return (
      <div role="alert" className="flex flex-col items-center gap-4 py-16 px-4 text-center">
        <p className="text-red-700 dark:text-red-300">{errorMessage}</p>
        <button
          type="button"
          className="btn-primary w-auto"
          onClick={() => {
            setErrorMessage(null);
            setAttempt((n) => n + 1);
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!clientSecret || !stripe || !elements) {
    return <Spinner message="Preparing checkout…" />;
  }

  return (
    <div className="flex flex-col w-full items-center max-w-[1320px] py-10 px-4">
      <div className="w-full overflow-auto scrollable-container">
        <div className="mb-10 flex flex-col gap-3 items-center">
          <h1 className="text-2xl md:text-4xl">Buy 10,000 Credits</h1>
          <h2 className="text-xl md:text-2xl">
            Purchase amount:{" "}
            <span className="font-bold tabular-nums">
              {priceLabel}
            </span>
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#40424A] p-2 rounded-md w-full"
        >
          {clientSecret && <PaymentElement />}

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <button
            type="submit"
            disabled={!stripe || loading}
            className="mt-2 w-full rounded-md bg-black p-5 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A8F70] disabled:animate-pulse disabled:opacity-50"
          >
            {!loading ? `Pay ${priceLabel}` : "Processing…"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentCheckout;
