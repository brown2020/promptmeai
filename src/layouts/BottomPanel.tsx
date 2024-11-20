import Logo from "@/layouts/navigation-buttons/Logo";
import UserProfileButton from "@/components/UserProfileButton";
import { NavigationList } from "./navigation-buttons";
import { User } from "next-auth";

type BottomPanelProps = {
  user?: User;
};

const BottomPanel = ({ user }: BottomPanelProps) => {
  return (
    <div className="z-50 sm:hidden flex justify-between items-center h-[64px] flex-shrink-0 bg-white dark:bg-[#1E1F22] border-t border-[#EAEAEA] dark:border-[#1E1F22] p-[16px]">
      <Logo />
      <NavigationList />
      <UserProfileButton user={user} />
    </div>
  );
};

export default BottomPanel;
