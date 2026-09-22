"use client";

import { ButtonIcon } from "@/components/buttons";
import { usePlatform } from "@/zustand/usePlatformStore";
import { usePathname, useRouter } from "next/navigation";
import { RiListSettingsFill } from "react-icons/ri";
import { useAuthStore } from "@/zustand/useAuthStore";

const SettingsNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const uid = useAuthStore((s) => s.uid);
  const { isRNWebView } = usePlatform();

  return (
    <ButtonIcon
      icon={RiListSettingsFill}
      aria-label="Open settings"
      isActive={pathname.includes("settings")}
      onClick={() => {
        if (uid || !isRNWebView) {
          router.push("/settings");
        }
      }}
    />
  );
};

export default SettingsNav;
