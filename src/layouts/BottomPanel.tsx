import Logo from "@/layouts/navigation-buttons/Logo";
import UserProfileButton from "@/components/UserProfileButton";
import { NavigationList } from "./navigation-buttons";

const BottomPanel = () => {
  return (
    <div className="sm:hidden flex justify-between items-center h-[64px] flex-shrink-0 bg-white border-t border-[#EAEAEA] p-[16px]">
      <Logo />
      <NavigationList />
      <UserProfileButton />
    </div>
  );
};

export default BottomPanel;
