"use client";

import { PropsWithChildren } from "react";
import LeftPanel from "./LeftPanel";
import BottomPanel from "./BottomPanel";
import { usePathname } from "next/navigation";
import { User } from "next-auth";

type LayoutProps = {
  user?: User;
} & PropsWithChildren;

const Layout = ({ user, children }: LayoutProps) => {
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
      <LeftPanel user={user} />
      {children}
      <BottomPanel user={user} />
    </div>
  );
};

export default Layout;
