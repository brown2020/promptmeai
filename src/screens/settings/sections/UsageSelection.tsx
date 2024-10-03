"use client";

import CardContent from "@/components/CardContent";
import Select from "@/components/Select";
import useProfileStore, { UsageMode } from "@/zustand/useProfileStore";

const UsageSelection = () => {
  const { updateProfile, profile } = useProfileStore();

  return (
    <CardContent
      title="Mode"
      overrideStyles="col-span-1 lg:col-span-2 xl:col-span-3"
    >
      <Select
        label="Select usage mode:"
        options={[
          { label: "Credits", value: UsageMode.Credits },
          { label: "API Keys", value: UsageMode.ApiKeys },
        ]}
        value={profile.usageMode}
        onChange={(e) =>
          updateProfile({ usageMode: e.target.value as UsageMode })
        }
      />
    </CardContent>
  );
};

export default UsageSelection;
