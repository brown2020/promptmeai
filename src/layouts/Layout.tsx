import { PropsWithChildren } from "react";
import LeftPanel from "./LeftPanel";
import BottomPanel from "./BottomPanel";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col sm:flex-row h-screen w-screen dark:bg-[#272A2E]">
      <LeftPanel />
      {children}
      <BottomPanel />
    </div>
  );
};

export default Layout;
