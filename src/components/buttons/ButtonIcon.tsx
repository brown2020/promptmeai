import { cn } from "@/utils/tailwind";
import { PropsWithChildren } from "react";
import { IconType } from "react-icons/lib";
import { ClassNameValue } from "tailwind-merge";

type ButtonIconProps = {
  icon: IconType;
  type?: "default" | "primary" | "secondary";
  isActive?: boolean;
  iconSize?: number;
  className?: ClassNameValue;
  onClick?: () => void;
  "aria-label": string;
} & PropsWithChildren;

const ButtonIcon = ({
  icon: Icon,
  type = "default",
  isActive = false,
  iconSize = 18,
  className,
  ...props
}: ButtonIconProps) => {
  return (
    <button
      type="button"
      className={cn(
        "bg-[#F9F9F9] dark:bg-[#2D2E31] rounded-lg w-[32px] h-[32px] flex justify-center items-center shadow-xl cursor-pointer",
        {
          "bg-[#0B7A5E] dark:bg-[#0B7A5E]": isActive,
          "bg-[#0F8F70] dark:bg-[#0F8F70]": type === "primary",
          "bg-[#EFEFEF]": type === "secondary",
        },
        className
      )}
      {...props}
    >
      <Icon
        className={cn("text-[#1A4D40] dark:text-[#7DDFC4]", {
          "text-[#F5FFFB] dark:text-[#F5FFFB]": isActive || type === "primary",
          "text-[#1E1F22]": type === "secondary",
        })}
        size={iconSize}
        aria-hidden
      />
    </button>
  );
};

export default ButtonIcon;
