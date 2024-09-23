"use client";

import Button from "@/components/v2/Button";
import CardContent from "@/components/v2/CardContent";
import { GaugeComponent } from "react-gauge-component";

const CreditInformation = () => {
  return (
    <CardContent title="Credit Usage">
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
        value={90}
      />
      <Button color="#10A37F">Buy 10,000 Credits</Button>
    </CardContent>
  );
};

export default CreditInformation;
