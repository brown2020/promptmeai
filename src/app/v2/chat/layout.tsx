import LeftPanel from "@/layouts/LeftPanel";
import RowLayout from "@/layouts/RowLayout";
import { PropsWithChildren } from "react";

const ChatPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <RowLayout>
      <LeftPanel />
      {children}
    </RowLayout>
  );
};

export default ChatPageLayout;
