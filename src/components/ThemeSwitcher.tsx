import { LuSun } from "react-icons/lu";
import { MdNightlightRound } from "react-icons/md";

const ThemeSwitcher = () => {
  return (
    <div className="h-[32px] w-[60px] sm:h-[60px] sm:w-[32px] bg-[#E2E2E2] rounded-xl flex sm:flex-col justify-center items-center gap-[5px]">
      <button className="w-[20px] h-[20px] flex justify-center items-center cursor-pointer">
        <MdNightlightRound size={12} />
      </button>
      <button className="w-[20px] h-[20px] flex justify-center items-center bg-[#FFF] rounded-lg drop-shadow cursor-pointer">
        <LuSun size={12} />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
