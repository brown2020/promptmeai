"use client";

import Button from "@/components/v2/Button";
import CardContent from "@/components/v2/CardContent";
import useProfileStore from "@/zustand/useProfileStore";
import { useRouter } from "next/navigation";
import { GaugeComponent } from "react-gauge-component";

const CreditInformation = () => {
  const profile = useProfileStore((state) => state.profile);
  const router = useRouter();

  return (
    <CardContent title="Conversation Credits">
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
        value={(profile.credits / 1000) * 100}
      />
      <h4 className="self-center">
        Credit usage: {Math.round(1000 - profile.credits)} from 1000
      </h4>
      <Button onClick={() => router.push("/v2/payment-attempt")}>
        Buy 10,000 Credits
      </Button>
    </CardContent>
  );
};

export default CreditInformation;
