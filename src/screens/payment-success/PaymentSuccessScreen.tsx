"use client";

import { validatePaymentIntent } from "@/actions/paymentActions";
import { Button } from "@/components/buttons";
import CardContent from "@/components/CardContent";
import Spinner from "@/components/Spinner";
import GreenWhiteLayout from "@/layouts/GreenWhiteLayout";
import { formatNumber, subcurrencyToNumber } from "@/utils/number";
import { useAuthStore } from "@/zustand/useAuthStore";
import { usePaymentsStore } from "@/zustand/usePaymentsStore";
import useProfileStore from "@/zustand/useProfileStore";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { LuCheckCircle, LuCoins, LuCreditCard } from "react-icons/lu";

const PaymentSuccessScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent") || "";

  const { addPayment, checkIfPaymentProcessed } = usePaymentsStore(
    (state) => state
  );
  const addCredits = useProfileStore((state) => state.addCredits);
  const uid = useAuthStore((state) => state.uid);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [id, setId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    if (!paymentIntent) {
      setMessage("No payment intent found");
      setIsLoading(false);
      return;
    }

    const handlePaymentSuccess = async () => {
      try {
        const data = await validatePaymentIntent(paymentIntent);

        if (data.status === "succeeded") {
          // Check if payment is already processed
          const existingPayment = await checkIfPaymentProcessed(data.id);
          if (existingPayment) {
            setMessage("Payment has already been processed.");

            setId(existingPayment.id);
            setAmount(existingPayment.amount);
            setIsLoading(false);
            return;
          }

          setMessage("Payment successful");
          setId(data.id);
          setAmount(data.amount);

          // Add payment to store
          await addPayment({
            id: data.id,
            amount: data.amount,
            status: data.status,
          });

          // Add credits to profile
          const creditsToAdd = data.amount + 1;
          await addCredits(creditsToAdd);
        } else {
          setMessage("Payment validation failed");
        }
      } catch (error) {
        setMessage("Error handling payment success");
      } finally {
        setIsLoading(false);
      }
    };

    if (uid) handlePaymentSuccess();
  }, [addPayment, checkIfPaymentProcessed, addCredits, uid, paymentIntent]);

  return (
    <GreenWhiteLayout>
      <div className="w-full flex items-center justify-center p-4">
        <CardContent overrideStyles="w-full max-w-md flex flex-col items-center gap-8 p-6">
          {isLoading ? (
            <Spinner message="Proccessing the payment..." />
          ) : id ? (
            <Fragment>
              <div className="flex flex-col items-center gap-4">
                <div className="bg-[#E7E7E8] w-16 h-16 rounded-full flex items-center justify-center">
                  <LuCheckCircle size="36" />
                </div>
                <h2 className="text-2xl font-bold">Payment Successful!</h2>
              </div>

              <div className="flex flex-col items-center text-center gap-4">
                <p className="text-[#72717A]">
                  Thank you for your purchase. Your token credits have been
                  added to your account.
                </p>
                <div className="bg-[#F4F4F5] p-4 flex flex-col gap-2 w-full rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center text-[#18181B]">
                      <LuCoins size={20} />
                      <span>Token Credits</span>
                    </div>
                    <span className="font-semibold">{`${formatNumber(
                      amount + 1
                    )} credits`}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center text-[#18181B]">
                      <LuCreditCard size={20} />
                      <span>Amount Paid</span>
                    </div>
                    <span className="font-semibold">
                      {formatNumber(subcurrencyToNumber(amount), 2, "$")}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  router.push("/settings");
                }}
              >
                Return to Settings
              </Button>
            </Fragment>
          ) : (
            <div>{message}</div>
          )}
        </CardContent>
      </div>
    </GreenWhiteLayout>
  );
};

export default PaymentSuccessScreen;
