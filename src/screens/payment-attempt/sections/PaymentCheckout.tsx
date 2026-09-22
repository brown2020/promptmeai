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

type PaymentCheckoutProps = { amount: number };

const PaymentCheckout = ({ amount }: PaymentCheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);

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
  }, [amount]);

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

  if (!clientSecret || !stripe || !elements) {
    return <Spinner />;
  }

  return (
    <main className="flex flex-col w-full items-center max-w-[1320px] py-10 px-4">
      <div className="w-full overflow-auto scrollable-container">
        <div className="mb-10 flex flex-col gap-3 items-center">
          <h1 className="text-2xl md:text-4xl">Buy 10,000 Credits</h1>
          <h2 className="text-xl md:text-2xl">
            Purchase amount: <span className="font-bold">${amount}</span>
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
            className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
          >
            {!loading ? `Pay $${amount}` : "Processing..."}
          </button>
        </form>
      </div>
    </main>
  );
};

export default PaymentCheckout;
