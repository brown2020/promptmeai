"use client";

import { ButtonIcon } from "@/components/buttons";
import { usePlatform } from "@/zustand/usePlatformStore";
import { usePathname, useRouter } from "next/navigation";
import { RiListSettingsFill } from "react-icons/ri";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseClient";

const SettingsNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user] = useAuthState(auth);
  const isSignedIn = user?.uid;
  const { isRNWebView } = usePlatform();

  return (
    <ButtonIcon
      icon={RiListSettingsFill}
      isActive={pathname.includes("settings")}
      onClick={() => {
        if (isSignedIn || !isRNWebView) {
          router.push("/settings");
        }
      }}
    />
  );
};

export default SettingsNav;
