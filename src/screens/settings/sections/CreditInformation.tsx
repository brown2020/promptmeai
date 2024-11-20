"use client";

import { Button } from "@/components/buttons";
import CardContent from "@/components/CardContent";
import Spinner from "@/components/Spinner";
import { isIOSReactNativeWebView } from "@/utils/platform";
import { cn } from "@/utils/tailwind";
import { usePaymentsStore } from "@/zustand/usePaymentsStore";
import useProfileStore, { UsageMode } from "@/zustand/useProfileStore";
import { CircularProgress } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";

type CreditInformationProps = {
  userId: string;
};

const CreditInformation = ({ userId }: CreditInformationProps) => {
  const { profile, isLoading, isDefaultData, updateProfile } =
    useProfileStore();
  const router = useRouter();

  const [credits, setCredits] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [showCreditsSection, setShowCreditsSection] = useState(true);
  const { addPayment } = usePaymentsStore((state) => state);
  const addCredits = useProfileStore((state) => state.addCredits);

  useEffect(() => {
    setShowCreditsSection(!isIOSReactNativeWebView());
  }, []);

  useEffect(() => {
    const handleMessageFromRN = async (event: MessageEvent) => {
      // Process the message sent from React Native
      const message = event.data;
      if (message?.type === "IAP_SUCCESS") {
        await addPayment(userId, {
          id: message.message,
          amount: message.amount,
          status: "succeeded",
          mode: "iap",
          platform: message.platform,
          productId: message.productId,
          currency: message.currency,
        });
        await addCredits(userId, 10000);
      }
    };

    // Listen for messages from the RN WebView
    window.addEventListener("message", handleMessageFromRN);

    return () => {
      window.removeEventListener("message", handleMessageFromRN);
    };
  }, [addCredits, addPayment, userId]);

  useEffect(() => {
    if (profile.totalCredits) setTotalCredits(profile.totalCredits);
    if (profile.credits) setCredits(profile.credits);
  }, [profile]);

  useEffect(() => {
    if (!isDefaultData && totalCredits < credits) {
      updateProfile(userId, { totalCredits: credits }).then(() =>
        setTotalCredits(credits)
      );
    }
  }, [credits, isDefaultData, totalCredits, updateProfile, userId]);

  const creditUsage = useMemo(
    () => totalCredits - credits,
    [credits, totalCredits]
  );

  const creditPercentage = useMemo(() => {
    return totalCredits > 0 ? (credits / totalCredits) * 100 : 0;
  }, [credits, totalCredits]);

  const handleBuyClick = useCallback(() => {
    if (showCreditsSection) {
      router.push("/payment-attempt");
    } else {
      window.ReactNativeWebView?.postMessage("INIT_IAP");
    }
  }, [showCreditsSection, router]);

  return (
    <CardContent
      title="Conversation Credits"
      isActive={profile.usageMode === UsageMode.Credits}
    >
      {isLoading || !userId || isDefaultData ? (
        <Spinner />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <CircularProgress
            classNames={{
              svg: "w-60 h-60 drop-shadow-md",
              indicator: cn("stroke-default", {
                "stroke-[#24C69E]":
                  creditPercentage >= 60 && creditPercentage <= 100,
                "stroke-[#F6CC19]":
                  creditPercentage >= 40 && creditPercentage < 60,
                "stroke-[#F58B1A]":
                  creditPercentage >= 20 && creditPercentage < 40,
                "stroke-[#EA4227]":
                  creditPercentage >= 0 && creditPercentage < 20,
              }),
              track: cn("stroke-default/10", {
                "stroke-[#24C69E]/10":
                  creditPercentage >= 60 && creditPercentage <= 100,
                "stroke-[#F6CC19]/10":
                  creditPercentage >= 40 && creditPercentage < 60,
                "stroke-[#F58B1A]/10":
                  creditPercentage >= 20 && creditPercentage < 40,
                "stroke-[#EA4227]/10":
                  creditPercentage >= 0 && creditPercentage < 20,
              }),
              value: cn("text-3xl font-semibold text-default", {
                "text-[#24C69E]":
                  creditPercentage >= 60 && creditPercentage <= 100,
                "text-[#F6CC19]":
                  creditPercentage >= 40 && creditPercentage < 60,
                "text-[#F58B1A]":
                  creditPercentage >= 20 && creditPercentage < 40,
                "text-[#EA4227]":
                  creditPercentage >= 0 && creditPercentage < 20,
              }),
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
          <h4 className="self-center">{`Credit usage: ${creditUsage} from ${totalCredits}`}</h4>
        </div>
      )}
      <Button onClick={handleBuyClick}>Buy 10,000 Credits</Button>
    </CardContent>
  );
};

export default CreditInformation;
