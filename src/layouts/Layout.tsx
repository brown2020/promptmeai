"use client";

import { PropsWithChildren } from "react";
import LeftPanel from "./LeftPanel";
import BottomPanel from "./BottomPanel";
import { usePathname } from "next/navigation";

const safeArea =
  "pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]";

const Layout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const hidePanelPaths = ["/privacy", "/terms", "/support", "/login", "/signup", "/forgot-password"];
  const hidePanels = hidePanelPaths.includes(pathname);

  return (
    <div
      className={
        hidePanels
          ? `flex flex-col h-container-small md:h-container-custom overflow-y-scroll box-border ${safeArea}`
          : `flex flex-col sm:flex-row h-dvh w-full box-border dark:bg-[#272A2E] ${safeArea}`
      }
    >
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {!hidePanels && <LeftPanel />}
      <main
        id="main"
        className={
          hidePanels
            ? "flex h-full min-h-0 flex-1 flex-col"
            : "flex min-h-0 min-w-0 flex-1 flex-col sm:flex-row"
        }
      >
        {children}
      </main>
      {!hidePanels && <BottomPanel />}
    </div>
  );
};

export default Layout;
