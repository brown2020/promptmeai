import { PropsWithChildren } from "react";

const GreenWhiteLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-screen h-screen bg-white relative">
      <div className="w-full bg-[#24C69E] h-[235px] rounded-b-2xl relative" />
      <div className="absolute top-5 left-[10px] bg-[white] shadow w-[calc(100%-64px)] h-[calc(100%-64px)] rounded-2xl m-6 flex justify-center">
        {children}
      </div>
    </div>
  );
};

export default GreenWhiteLayout;
