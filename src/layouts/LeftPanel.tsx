import { CgProfile } from "react-icons/cg";
import { PiChatsCircle } from "react-icons/pi";
import { RiListSettingsFill, RiLogoutBoxRLine } from "react-icons/ri";
import Logo from "@/components/v2/Logo";
import ButtonIcon from "@/components/v2/ButtonIcon";
import Divider from "@/components/v2/Divider";
import ThemeSwitcher from "@/components/v2/ThemeSwitcher";

const LeftPanel = () => {
  return (
    <div className="flex flex-col justify-between items-center w-[64px] flex-shrink-0 bg-white border-r border-[#EAEAEA] p-[16px]">
      {/* Top section */}
      <div className="flex flex-col gap-[64px] justify-center items-center">
        <Logo />
        <div className="flex flex-col gap-[24px] justify-center items-center">
          <ButtonIcon icon={PiChatsCircle} isActive />
          <ButtonIcon icon={RiListSettingsFill} />
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col gap-[25px] justify-center items-center">
        <ButtonIcon icon={CgProfile} />
        <ButtonIcon icon={RiLogoutBoxRLine} />

        <Divider />
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default LeftPanel;
