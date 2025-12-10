"use client";

import { Button } from "@/components/buttons";
import CardContent from "@/components/CardContent";
import Spinner from "@/components/Spinner";
import { auth } from "@/firebase/firebaseClient";
import { usePlatform } from "@/zustand/usePlatformStore";
import { cn } from "@/utils/tailwind";
import { usePaymentsStore } from "@/zustand/usePaymentsStore";
import useProfileStore, { UsageMode } from "@/zustand/useProfileStore";
import { CircularProgress } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useCallback } from "react";

const CreditInformation = () => {
  const user = auth.currentUser;
  const { profile, isLoading, isDefaultData, updateProfile } =
    useProfileStore();
  const router = useRouter();
  const { isRNWebView, isWeb } = usePlatform();

  const { addPayment } = usePaymentsStore((state) => state);
  const addCredits = useProfileStore((state) => state.addCredits);

  // Handle messages from React Native WebView for IAP
  useEffect(() => {
    const handleMessageFromRN = async (event: MessageEvent) => {
      const message = event.data;
      if (message?.type === "IAP_SUCCESS") {
        await addPayment({
          id: message.message,
          amount: message.amount,
          status: "succeeded",
          mode: "iap",
          platform: message.platform,
          productId: message.productId,
          currency: message.currency,
        });
        await addCredits(10000);
      }
    };

    window.addEventListener("message", handleMessageFromRN);
    return () => window.removeEventListener("message", handleMessageFromRN);
  }, [addCredits, addPayment]);

  // Sync totalCredits if credits exceed it
  useEffect(() => {
    if (!isDefaultData && profile.totalCredits < profile.credits) {
      updateProfile({ totalCredits: profile.credits });
    }
  }, [profile.credits, profile.totalCredits, isDefaultData, updateProfile]);

  const creditUsage = useMemo(
    () => profile.totalCredits - profile.credits,
    [profile.credits, profile.totalCredits]
  );

  const creditPercentage = useMemo(() => {
    return profile.totalCredits > 0
      ? (profile.credits / profile.totalCredits) * 100
      : 0;
  }, [profile.credits, profile.totalCredits]);

  const handleBuyClick = useCallback(() => {
    if (isWeb) {
      router.push("/payment-attempt");
    } else {
      window.ReactNativeWebView?.postMessage("INIT_IAP");
    }
  }, [isWeb, router]);

  const getColorClass = (percentage: number) => {
    if (percentage >= 60) return "#24C69E";
    if (percentage >= 40) return "#F6CC19";
    if (percentage >= 20) return "#F58B1A";
    return "#EA4227";
  };

  const colorClass = getColorClass(creditPercentage);

  return (
    <CardContent
      title="Conversation Credits"
      isActive={profile.usageMode === UsageMode.Credits}
    >
      {isLoading || !user || isDefaultData ? (
        <Spinner />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <CircularProgress
            classNames={{
              svg: "w-60 h-60 drop-shadow-md",
              indicator: cn("stroke-default", `stroke-[${colorClass}]`),
              track: cn("stroke-default/10", `stroke-[${colorClass}]/10`),
              value: cn(
                "text-3xl font-semibold text-default",
                `text-[${colorClass}]`
              ),
            }}
            value={creditPercentage}
            strokeWidth={4}
            showValueLabel={true}
            formatOptions={{
              style: "percent",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }}
          />
          <h4 className="self-center">{`Credit usage: ${creditUsage} from ${profile.totalCredits}`}</h4>
        </div>
      )}
      <Button onClick={handleBuyClick}>Buy 10,000 Credits</Button>
    </CardContent>
  );
};

export default CreditInformation;
