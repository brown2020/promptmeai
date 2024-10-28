"use client"

import CreditInformation from "./sections/CreditInformation";
import InputAPIKeys from "./sections/InputAPIKeys";
import PaymentHistory from "./sections/PaymentHistory";
import GreenWhiteLayout from "@/layouts/GreenWhiteLayout";
import UsageSelection from "./sections/UsageSelection";
import { isIOSReactNativeWebView } from "@/utils/platform";
import { useEffect, useState } from "react";

const SettingsScreen = () => {
  const [isRnWebView, setRnWebview] = useState(false);

  useEffect(() => {
    setRnWebview(isIOSReactNativeWebView());
  }, []);

  return (
    <GreenWhiteLayout>
      <div className="flex flex-col gap-2 sm:gap-5 p-4 sm:p-8 max-w-[1320px] w-full">
        <h2 className="font-medium text-[20px] sm:text-[24px] dark:text-[#FFF]">
          Account Settings
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 overflow-auto scrollable-container">
          <UsageSelection hideKey={isRnWebView} />
          <CreditInformation />
          {!isRnWebView && <InputAPIKeys />}
          <PaymentHistory />
        </div>
      </div>
    </GreenWhiteLayout>
  );
};

export default SettingsScreen;
