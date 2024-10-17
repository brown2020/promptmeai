"use client";

import { Button } from "@/components/buttons";
import CardContent from "@/components/CardContent";
import Spinner from "@/components/Spinner";
import { cn } from "@/utils/tailwind";
import useProfileStore, { UsageMode } from "@/zustand/useProfileStore";
import { useUser } from "@clerk/nextjs";
import { CircularProgress } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

const CreditInformation = () => {
  const { user } = useUser();
  const { profile, isLoading, isDefaultData, updateProfile } =
    useProfileStore();
  const router = useRouter();

  const [credits, setCredits] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);

  useEffect(() => {
    if (profile.totalCredits) setTotalCredits(profile.totalCredits);
    if (profile.credits) setCredits(profile.credits);
  }, [profile]);

  useEffect(() => {
    if (!isDefaultData && totalCredits < credits) {
      updateProfile({ totalCredits: credits }).then(() =>
        setTotalCredits(credits)
      );
    }
  }, [credits, isDefaultData, totalCredits, updateProfile]);

  const creditUsage = useMemo(
    () => totalCredits - credits,
    [credits, totalCredits]
  );

  const creditPercentage = useMemo(() => {
    return totalCredits > 0 ? (credits / totalCredits) * 100 : 0;
  }, [credits, totalCredits]);

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
      <Button onClick={() => router.push("/payment-attempt")}>
        Buy 10,000 Credits
      </Button>
    </CardContent>
  );
};

export default CreditInformation;
