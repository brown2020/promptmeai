"use client";

import { ButtonIcon } from "@/components/buttons";
import { isIOSReactNativeWebView } from "@/utils/platform";
import { useAuthStore } from "@/zustand/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { RiListSettingsFill } from "react-icons/ri";

const SettingsNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const uid = useAuthStore((state) => state.uid);

  return (
    <ButtonIcon
      icon={RiListSettingsFill}
      isActive={pathname.includes("settings")}
      onClick={() => {
        if (uid || !isIOSReactNativeWebView()) {
          router.push("/settings");
        }
      }}
    />
  );
};

export default SettingsNav;
