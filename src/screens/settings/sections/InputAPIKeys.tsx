"use client";

import { saveApiKeys } from "@/actions/profileActions";
import { Button } from "@/components/buttons";
import CardContent from "@/components/CardContent";
import Input from "@/components/Input";
import { isEncryptedSecret } from "@/firebase/secretBox";
import useProfileStore, { APIKeys, UsageMode } from "@/zustand/useProfileStore";
import { useState } from "react";
import toast from "react-hot-toast";

const emptyKeys = (): APIKeys => ({
  openAi: "",
  anthropic: "",
  googleGenerativeAi: "",
});

const hasSavedKey = (value: string | undefined) =>
  Boolean(value && (isEncryptedSecret(value) || value.trim().length > 0));

const InputAPIKeys = () => {
  const { profile, fetchProfile } = useProfileStore();
  const [apiKeys, setApiKeys] = useState<APIKeys>(emptyKeys);
  const [saving, setSaving] = useState(false);

  const changeApiKeyHandler = (key: keyof APIKeys, value: string) => {
    setApiKeys((current) => ({ ...current, [key]: value }));
  };

  const updateApiKeysHandler = async (clear = false) => {
    setSaving(true);
    try {
      await saveApiKeys(
        clear
          ? {
              ...emptyKeys(),
              clearOpenAi: true,
              clearAnthropic: true,
              clearGoogle: true,
            }
          : apiKeys
      );
      setApiKeys(emptyKeys());
      await fetchProfile();
      toast.success(clear ? "API keys removed." : "API keys saved.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      toast.error(
        message.includes("not configured")
          ? "API key storage is not configured."
          : "Failed to save API keys."
      );
    } finally {
      setSaving(false);
    }
  };

  const placeholder = (saved: boolean) =>
    saved ? "Saved — leave blank to keep" : "Enter your API key…";

  return (
    <CardContent
      title="API Keys"
      overrideStyles="xl:col-span-2"
      isActive={profile.usageMode === UsageMode.ApiKeys}
    >
      <div className="grid xl:grid-rows-2 xl:grid-flow-col gap-4">
        <Input
          title="Open AI"
          type="password"
          autoComplete="off"
          value={apiKeys.openAi}
          placeholder={placeholder(hasSavedKey(profile.APIKeys.openAi))}
          onChange={(e) => changeApiKeyHandler("openAi", e.target.value)}
        />
        <Input
          title="Anthropic"
          type="password"
          autoComplete="off"
          value={apiKeys.anthropic}
          placeholder={placeholder(hasSavedKey(profile.APIKeys.anthropic))}
          onChange={(e) => changeApiKeyHandler("anthropic", e.target.value)}
        />
        <Input
          title="Google Generative AI"
          type="password"
          autoComplete="off"
          value={apiKeys.googleGenerativeAi}
          placeholder={placeholder(hasSavedKey(profile.APIKeys.googleGenerativeAi))}
          onChange={(e) => changeApiKeyHandler("googleGenerativeAi", e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button disabled={saving} onClick={() => void updateApiKeysHandler(false)}>
          Update API Keys
        </Button>
        <Button disabled={saving} onClick={() => void updateApiKeysHandler(true)}>
          Clear saved keys
        </Button>
      </div>
    </CardContent>
  );
};

export default InputAPIKeys;
