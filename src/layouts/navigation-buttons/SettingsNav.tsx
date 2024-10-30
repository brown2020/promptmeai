"use client";

import { ButtonIcon } from "@/components/buttons";
import { isIOSReactNativeWebView } from "@/utils/platform";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { RiListSettingsFill } from "react-icons/ri";

const SettingsNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  return (
    <ButtonIcon
      icon={RiListSettingsFill}
      isActive={pathname.includes("settings")}
      onClick={() => {
        if (isSignedIn || !isIOSReactNativeWebView()) {
          router.push("/settings");
        }
      }}
    />
  );
};

export default SettingsNav;
