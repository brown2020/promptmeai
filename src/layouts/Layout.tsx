"use client";

import { PropsWithChildren } from "react";
import LeftPanel from "./LeftPanel";
import BottomPanel from "./BottomPanel";
import { usePathname } from "next/navigation";

const Layout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const hidePanelPaths = ["/privacy", "/terms", "/support"];

  if (hidePanelPaths.includes(pathname)) {
    return (
      <div className="flex flex-col h-container-small md:h-container-custom overflow-y-scroll">
        <div className="flex flex-col h-full flex-1">{children}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row h-screen w-screen dark:bg-[#272A2E]">
      <LeftPanel />
      {children}
      <BottomPanel />
    </div>
  );
};

export default Layout;
