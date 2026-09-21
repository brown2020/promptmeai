"use client";

import { grantCatalogPurchase } from "@/actions/paymentActions";
import { Button } from "@/components/buttons";
import CardContent from "@/components/CardContent";
import Spinner from "@/components/Spinner";
import GreenWhiteLayout from "@/layouts/GreenWhiteLayout";
import { formatNumber, subcurrencyToNumber } from "@/utils/number";
import { useAuthStore } from "@/zustand/useAuthStore";
import useProfileStore from "@/zustand/useProfileStore";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { LuCheck, LuCoins, LuCreditCard } from "react-icons/lu";

const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent") || "";

  const fetchProfile = useProfileStore((state) => state.fetchProfile);
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
        const result = await grantCatalogPurchase(paymentIntent);
        setMessage(
          result.alreadyProcessed
            ? "Payment has already been processed."
            : "Payment successful"
        );
        setId(paymentIntent);
        setAmount(9999);
        await fetchProfile();
      } catch (error) {
        console.error("Error handling payment success:", error);
        setMessage("Error handling payment success");
      } finally {
        setIsLoading(false);
      }
    };

    if (uid) handlePaymentSuccess();
  }, [fetchProfile, uid, paymentIntent]);

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
                  <LuCheck size="36" className="dark:text-[#2E987D]" />
                </div>
                <h2 className="text-2xl font-bold">Payment Successful!</h2>
              </div>

              <div className="flex flex-col items-center text-center gap-4">
                <p className="text-[#72717A] dark:text-[#EEE]">
                  Thank you for your purchase. Your token credits have been
                  added to your account.
                </p>
                <div className="bg-[#F4F4F5] dark:bg-[#F4F4F5]/[0.8] p-4 flex flex-col gap-2 w-full rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center text-[#18181B]">
                      <LuCoins size={20} />
                      <span>Token Credits</span>
                    </div>
                    <span className="font-semibold text-[#18181B]">
                      {formatNumber(10_000)} credits
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center text-[#18181B]">
                      <LuCreditCard size={20} />
                      <span>Amount Paid</span>
                    </div>
                    <span className="font-semibold text-[#18181B]">
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

export default PaymentSuccess;
