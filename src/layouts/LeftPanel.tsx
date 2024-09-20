"use client";

import { PiChatsCircle } from "react-icons/pi";
import { RiListSettingsFill } from "react-icons/ri";
import Logo from "@/components/v2/Logo";
import ButtonIcon from "@/components/v2/ButtonIcon";
import Divider from "@/components/v2/Divider";
import ThemeSwitcher from "@/components/v2/ThemeSwitcher";
import UserProfileButton from "@/components/v2/UserProfileButton";
import { useRouter } from "next/navigation";

const LeftPanel = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-between items-center w-[64px] flex-shrink-0 bg-white border-r border-[#EAEAEA] p-[16px]">
      {/* Top section */}
      <div className="flex flex-col gap-[64px] justify-center items-center">
        <Logo />
        <div className="flex flex-col gap-[24px] justify-center items-center">
          <ButtonIcon
            icon={PiChatsCircle}
            isActive
            onClick={() => router.push("/v2/chat")}
          />
          <ButtonIcon
            icon={RiListSettingsFill}
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
