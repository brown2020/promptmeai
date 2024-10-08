import Logo from "@/layouts/navigation-buttons/Logo";
import Divider from "@/components/Divider";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import UserProfileButton from "@/components/UserProfileButton";
import { NavigationList } from "./navigation-buttons";

const LeftPanel = () => {
  return (
    <div className="hidden sm:flex flex-col justify-between items-center w-[64px] flex-shrink-0 bg-white border-r border-[#EAEAEA] p-[16px]">
      {/* Top section */}
      <div className="flex flex-col gap-[64px] justify-center items-center">
        <Logo />
        <NavigationList />
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
