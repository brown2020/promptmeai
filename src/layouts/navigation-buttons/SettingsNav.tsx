"use client";

import { ButtonIcon } from "@/components/buttons";
import { usePathname, useRouter } from "next/navigation";
import { RiListSettingsFill } from "react-icons/ri";

const SettingsNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <ButtonIcon
      icon={RiListSettingsFill}
      isActive={pathname.includes("settings")}
      onClick={() => router.push("/settings")}
    />
  );
};

export default SettingsNav;
