"use client";

import { Button } from "@/components/buttons";
import CardContent from "@/components/CardContent";
import Input from "@/components/Input";
import { areObjectsEqual } from "@/utils/object";
import useProfileStore, { APIKeys, UsageMode } from "@/zustand/useProfileStore";
import { useEffect, useState } from "react";

const InputAPIKeys = () => {
  const { profile, updateProfile } = useProfileStore();
  const [apiKeys, setApiKeys] = useState<APIKeys>({ ...profile.APIKeys });

  useEffect(() => {
    if (profile.APIKeys) {
      setApiKeys(profile.APIKeys);
    }
  }, [profile.APIKeys]);

  const changeApiKeyHandler = (key: keyof APIKeys, value: string) => {
    const newData = { ...apiKeys };
    newData[key] = value;

    setApiKeys(newData);
  };

  const updateApiKeysHandler = () => {
    updateProfile({ APIKeys: apiKeys });
  };

  return (
    <CardContent
      title="API Keys"
      overrideStyles="xl:col-span-2"
      isActive={profile.usageMode === UsageMode.ApiKeys}
    >
      <div className="grid xl:grid-rows-3 xl:grid-flow-col gap-4">
        <Input
          title="Open AI"
          value={apiKeys.openAi}
          onChange={(e) => changeApiKeyHandler("openAi", e.target.value)}
        />
        <Input
          title="Anthropic"
          value={apiKeys.anthropic}
          onChange={(e) => changeApiKeyHandler("anthropic", e.target.value)}
        />
        <Input
          title="Google Generative AI"
          value={apiKeys.googleGenerativeAi}
          onChange={(e) =>
            changeApiKeyHandler("googleGenerativeAi", e.target.value)
          }
        />
        <Input
          title="Mistral"
          value={apiKeys.mistral}
          onChange={(e) => changeApiKeyHandler("mistral", e.target.value)}
        />
        <Input
          title="Fireworks"
          value={apiKeys.fireworks}
          onChange={(e) => changeApiKeyHandler("fireworks", e.target.value)}
        />
      </div>
      <Button
        disabled={areObjectsEqual<APIKeys>(apiKeys, profile.APIKeys)}
        onClick={updateApiKeysHandler}
      >
        Update API Keys
      </Button>
    </CardContent>
  );
};

export default InputAPIKeys;
