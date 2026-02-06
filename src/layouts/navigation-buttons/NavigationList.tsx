import ChatNav from "./ChatNav";
import SettingsNav from "./SettingsNav";

const NavigationList = () => {
  return (
    <div className="flex sm:flex-col gap-[24px] justify-center items-center">
      <ChatNav />
      <SettingsNav />
    </div>
  );
};

export default NavigationList;
