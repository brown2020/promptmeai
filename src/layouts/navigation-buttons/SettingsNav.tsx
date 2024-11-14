"use client";

import { ButtonIcon } from "@/components/buttons";
import { isIOSReactNativeWebView } from "@/utils/platform";
import { usePathname, useRouter } from "next/navigation";
import { RiListSettingsFill } from "react-icons/ri";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseClient";


const SettingsNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user] = useAuthState(auth);
  const isSignedIn = user?.uid;

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
