import LeftPanel from "@/layouts/LeftPanel";
import RowLayout from "@/layouts/RowLayout";
import { PropsWithChildren } from "react";

const SettingsPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <RowLayout>
      <LeftPanel />
      {children}
    </RowLayout>
  );
};

export default SettingsPageLayout;
