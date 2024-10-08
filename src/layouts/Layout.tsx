import { PropsWithChildren } from "react";
import LeftPanel from "./LeftPanel";
import BottomPanel from "./BottomPanel";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col sm:flex-row h-screen w-screen">
      <LeftPanel />
      {children}
      <BottomPanel />
    </div>
  );
};

export default Layout;
