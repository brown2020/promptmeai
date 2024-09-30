"use client";

import Button from "@/components/v2/Button";
import CardContent from "@/components/v2/CardContent";
import Input from "@/components/v2/Input";
import useProfileStore, { UsageMode } from "@/zustand/useProfileStore";

const APIKeys = () => {
  const { profile } = useProfileStore();

  return (
    <CardContent
      title="API Keys"
      overrideStyles="xl:col-span-2"
      isActive={profile.usageMode === UsageMode.ApiKeys}
    >
      <div className="grid xl:grid-rows-3 xl:grid-flow-col gap-4">
        <Input title="Open AI" />
        <Input title="Anthropic" />
        <Input title="Google Generative AI" />
        <Input title="Mistral" />
        <Input title="Fireworks" />
      </div>
      <Button disabled>Update API Keys</Button>
    </CardContent>
  );
};

export default APIKeys;
