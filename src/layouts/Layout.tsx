import { PropsWithChildren } from "react";
import LeftPanel from "./LeftPanel";
import BottomPanel from "./BottomPanel";
import { User } from "next-auth";

type LayoutProps = {
  user?: User;
} & PropsWithChildren;

const Layout = ({ user, children }: LayoutProps) => {
  return (
    <div className="flex flex-col sm:flex-row h-screen w-screen dark:bg-[#272A2E]">
      <LeftPanel user={user} />
      {children}
      <BottomPanel user={user} />
    </div>
  );
};

export default Layout;
