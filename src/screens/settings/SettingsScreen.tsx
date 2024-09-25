import CreditInformation from "./sections/CreditInformation";
import APIKeys from "./sections/APIKeys";
import PaymentHistory from "./sections/PaymentHistory";

const SettingsScreen = () => {
  return (
    <div className="flex flex-col gap-5 p-8 max-w-[1320px] w-full">
      <h2 className="font-medium text-[24px]">Account Settings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 overflow-auto scrollable-container">
        <CreditInformation />
        <APIKeys />
        <PaymentHistory />
      </div>
    </div>
  );
};

export default SettingsScreen;
