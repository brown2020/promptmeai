import Logo from "@/layouts/navigation-buttons/Logo";
import UserProfileButton from "@/components/UserProfileButton";
import { NavigationList } from "./navigation-buttons";

const BottomPanel = () => {
  return (
    <div className="sm:hidden flex justify-between items-center h-[64px] flex-shrink-0 bg-white dark:bg-[#1E1F22] border-t border-[#EAEAEA] dark:border-[#1E1F22] p-[16px]">
      <Logo />
      <NavigationList />
      <UserProfileButton />
    </div>
  );
};

export default BottomPanel;
