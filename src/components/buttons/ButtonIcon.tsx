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
    <div
      className={cn(
        "bg-[#F9F9F9] dark:bg-[#2D2E31] rounded-lg w-[32px] h-[32px] flex justify-center items-center shadow-xl cursor-pointer",
        {
          "bg-[#10A37F] dark:bg-[#10A37F]": isActive,
          "bg-[#23C69E] dark:bg-[#24C69E]": type === "primary",
          "bg-[#EFEFEF]": type === "secondary",
        },
        className
      )}
      {...props}
    >
      <Icon
        className={cn("text-[#255148] dark:text-[#23C69E]", {
          "text-white dark:text-[#EEEEEE]": isActive,
          "text-white dark:text-white": type === "primary",
          "text-[#3B3B3B]": type === "secondary",
        })}
        size={iconSize}
      />
    </div>
  );
};

export default ButtonIcon;
