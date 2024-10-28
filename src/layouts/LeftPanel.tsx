import Logo from "@/layouts/navigation-buttons/Logo";
import Divider from "@/components/Divider";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import UserProfileButton from "@/components/UserProfileButton";
import { NavigationList } from "./navigation-buttons";
import { ClerkProvider } from "@clerk/nextjs";

const LeftPanel = () => {
  return (
    <div className="hidden sm:flex flex-col justify-between items-center w-[64px] flex-shrink-0 bg-white dark:bg-[#1E1F22] border-r border-[#EAEAEA] dark:border-[#1E1F22] p-[16px]">
      {/* Top section */}
      <div className="flex flex-col gap-[64px] justify-center items-center">
        <Logo />
        <NavigationList />
      </div>

      {/* Bottom section */}
      <div className="flex flex-col gap-[25px] justify-center items-center">
        <ClerkProvider dynamic>
          <UserProfileButton />
        </ClerkProvider>

        <Divider />
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default LeftPanel;
