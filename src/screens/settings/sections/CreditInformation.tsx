"use client";

import Button from "@/components/v2/Button";
import CardContent from "@/components/v2/CardContent";
import Spinner from "@/components/v2/Spinner";
import useProfileStore from "@/zustand/useProfileStore";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { GaugeComponent } from "react-gauge-component";

const CreditInformation = () => {
  const { profile, isLoading } = useProfileStore((state) => state);
  const router = useRouter();

  const totalCredits = profile.totalCredits;
  const credits = profile.credits;

  return (
    <CardContent title="Conversation Credits">
      {isLoading || totalCredits === 0 ? (
        <Spinner />
      ) : (
        <Fragment>
          <GaugeComponent
            arc={{
              subArcs: [
                {
                  limit: 20,
                  color: "#EA4228",
                  showTick: true,
                },
                {
                  limit: 40,
                  color: "#F58B19",
                  showTick: true,
                },
                {
                  limit: 60,
                  color: "#F5CD19",
                  showTick: true,
                },
                {
                  limit: 100,
                  color: "#5BE12C",
                  showTick: true,
                },
              ],
            }}
            value={(credits / totalCredits) * 100}
          />
          <h4 className="self-center">
            {`Credit usage: ${Math.round(
              totalCredits - credits
            )} from ${totalCredits}`}
          </h4>
        </Fragment>
      )}

      <Button onClick={() => router.push("/v2/payment-attempt")}>
        Buy 10,000 Credits
      </Button>
    </CardContent>
  );
};

export default CreditInformation;
