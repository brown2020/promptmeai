import { cn } from "@/utils/tailwind";
import { PropsWithChildren } from "react";

type CardContentProps = {
  title?: string;
  overrideStyles?: string;
} & PropsWithChildren;

const CardContent = ({ title, overrideStyles, children }: CardContentProps) => {
  return (
    <div
      className={cn(
        "border border-[#E5EAEE] p-4 rounded-lg flex flex-col gap-4",
        overrideStyles
      )}
    >
      {title && <h3 className="text-[20px]">{title}</h3>}
      {children}
    </div>
  );
};

export default CardContent;
