import { PropsWithChildren } from "react";

const RowLayout = ({ children }: PropsWithChildren) => {
  return <div className="flex h-screen w-screen">{children}</div>;
};

export default RowLayout;
