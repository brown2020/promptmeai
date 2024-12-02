import { PropsWithChildren } from "react";
import Footer from "./Footer";

const GreenWhiteLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-screen h-screen bg-white dark:bg-[#272A2E] relative">
      <div className="w-full bg-[#24C69E] dark:bg-[#24C69E]/[0.7] h-[235px] rounded-b-2xl relative" />
      <div className="absolute top-2 sm:top-5 left-[10px] bg-[white] dark:bg-[#40424A] shadow dark:shadow-lg w-[calc(100%-35px)] sm:w-[calc(100%-64px)] h-[calc(100%-73px)] sm:h-[calc(100%-101px)] rounded-2xl m-2 sm:m-6 flex justify-center">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default GreenWhiteLayout;
