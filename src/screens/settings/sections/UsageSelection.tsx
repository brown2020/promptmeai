"use client";

import CardContent from "@/components/CardContent";
import Select from "@/components/Select";
import useProfileStore, { UsageMode } from "@/zustand/useProfileStore";

type UsageSelectionProps = {
  userId: string;
  hideKey?: boolean;
};

const UsageSelection = ({ userId, hideKey }: UsageSelectionProps) => {
  const { updateProfile, profile } = useProfileStore();

  return (
    <CardContent
      title="Mode"
      overrideStyles="col-span-1 lg:col-span-2 xl:col-span-3"
    >
      <Select
        label="Select usage mode:"
        options={
          hideKey
            ? [{ label: "Credits", value: UsageMode.Credits }]
            : [
                { label: "Credits", value: UsageMode.Credits },
                { label: "API Keys", value: UsageMode.ApiKeys },
              ]
        }
        value={profile.usageMode}
        onChange={(e) =>
          updateProfile(userId, { usageMode: e.target.value as UsageMode })
        }
      />
    </CardContent>
  );
};

export default UsageSelection;
