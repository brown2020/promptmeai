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
        <button
          type="button"
          aria-label="Show credit usage"
          className="absolute -top-7 -right-3 flex size-11 cursor-pointer items-center justify-center rounded-full bg-amber-200 drop-shadow-md hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A8F70]"
        >
          <LuCoins size={16} aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent className="drop-shadow-md shadow-md rounded-md">
        <div className="flex flex-col gap-1 p-1 text-[12px]">
          <span>
            Token usage: <span className="font-semibold tabular-nums">{tokenUsage}</span>
          </span>
          <span>
            Credit usage:{" "}
            <span className="font-semibold tabular-nums">
              {formatNumber(calculateCreditCost(tokenUsage, false), 3)}
            </span>
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CreditUsage;
