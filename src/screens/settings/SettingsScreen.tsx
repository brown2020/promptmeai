import CreditInformation from "./sections/CreditInformation";
import APIKeys from "./sections/APIKeys";
import PaymentHistory from "./sections/PaymentHistory";

const SettingsScreen = () => {
  return (
    <div className="w-screen h-screen bg-white relative">
      {/* Green layer */}
      <div className="w-full bg-[#24C69E] h-[235px] rounded-b-2xl relative" />
      <div className="absolute top-5 left-[10px] bg-[white] shadow w-[calc(100%-64px)] h-[calc(100%-64px)] rounded-2xl m-6 flex justify-center">
        <div className="flex flex-col gap-5 p-8 max-w-[1320px] w-full">
          <h2 className="font-medium text-[24px]">Account Settings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 overflow-auto scrollable-container">
            <CreditInformation />
            <APIKeys />
            <PaymentHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
