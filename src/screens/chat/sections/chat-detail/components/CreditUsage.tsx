import { formatNumber } from "@/utils/number";
import { calculateCreditCost } from "@/utils/token";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { LuCoins } from "react-icons/lu";

type CreditUsageProps = {
  tokenUsage: number;
};

const CreditUsage = ({ tokenUsage }: CreditUsageProps) => {
  return (
    <Popover placement="top">
      <PopoverTrigger>
        <span className="cursor-pointer absolute top-[-26px] right-[-18px] bg-amber-200 hover:bg-amber-300 rounded-full w-[28px] h-[28px] flex justify-center items-center drop-shadow-md">
          <LuCoins size={14} />
        </span>
      </PopoverTrigger>
      <PopoverContent className="drop-shadow-md shadow-md rounded-md">
        <div className="flex flex-col gap-1 p-1 text-[12px]">
          <span>
            Token usage: <span className="font-semibold">{tokenUsage}</span>
          </span>
          <span>
            Credit usage:{" "}
            <span className="font-semibold">
              {formatNumber(calculateCreditCost(tokenUsage, false), 3)}
            </span>
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CreditUsage;
