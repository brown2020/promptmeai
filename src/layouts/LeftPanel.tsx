"use client";

import { PiChatsCircle } from "react-icons/pi";
import { RiListSettingsFill } from "react-icons/ri";
import Logo from "@/components/Logo";
import { ButtonIcon } from "@/components/buttons";
import Divider from "@/components/Divider";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import UserProfileButton from "@/components/UserProfileButton";
import { usePathname, useRouter } from "next/navigation";

const LeftPanel = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-between items-center w-[64px] flex-shrink-0 bg-white border-r border-[#EAEAEA] p-[16px]">
      {/* Top section */}
      <div className="flex flex-col gap-[64px] justify-center items-center">
        <Logo />
        <div className="flex flex-col gap-[24px] justify-center items-center">
          <ButtonIcon
            icon={PiChatsCircle}
            isActive={pathname.includes("chat")}
            onClick={() => router.push("/v2/chat")}
          />
          <ButtonIcon
            icon={RiListSettingsFill}
            isActive={pathname.includes("settings")}
            onClick={() => router.push("/v2/settings")}
          />
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col gap-[25px] justify-center items-center">
        <UserProfileButton />

        <Divider />
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default LeftPanel;
