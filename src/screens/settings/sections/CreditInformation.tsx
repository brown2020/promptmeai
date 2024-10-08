"use client";

import { Button } from "@/components/buttons";
import CardContent from "@/components/CardContent";
import Spinner from "@/components/Spinner";
import useProfileStore, { UsageMode } from "@/zustand/useProfileStore";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState, useMemo } from "react";
import { GaugeComponent } from "react-gauge-component";

const CreditInformation = () => {
  const { user } = useUser();
  const { profile, isLoading, isDefaultData, updateProfile } =
    useProfileStore();
  const router = useRouter();

  const [credits, setCredits] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);

  useEffect(() => {
    if (profile.totalCredits) {
      setTotalCredits(profile.totalCredits);
    }

    if (profile.credits) {
      setCredits(profile.credits);
    }
  }, [profile.credits, profile.totalCredits]);

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

  return (
    <CardContent
      title="Conversation Credits"
      isActive={profile.usageMode === UsageMode.Credits}
    >
      {isLoading || !user || isDefaultData ? (
        <Spinner />
      ) : (
        <Fragment>
          <GaugeComponent
            arc={{
              subArcs: [
                { limit: 20, color: "#EA4228", showTick: true },
                { limit: 40, color: "#F58B19", showTick: true },
                { limit: 60, color: "#F5CD19", showTick: true },
                { limit: 100, color: "#5BE12C", showTick: true },
              ],
            }}
            value={(credits / totalCredits) * 100 || 0}
          />
          <h4 className="self-center">{`Credit usage: ${creditUsage} from ${totalCredits}`}</h4>
        </Fragment>
      )}
      <Button onClick={() => router.push("/payment-attempt")}>
        Buy 10,000 Credits
      </Button>
    </CardContent>
  );
};

export default CreditInformation;
