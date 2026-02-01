import { InputHTMLAttributes } from "react";
import { cn } from "@/utils/tailwind";

type InputProps = {
  title: string;
  error?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({ title, error, className, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-base text-gray-900 dark:text-gray-100">
        {title}
      </label>
      <input
        {...props}
        className={cn(
          "py-2.5 px-3.5 rounded-md border transition-colors outline-none",
          "bg-white dark:bg-gray-800",
          "border-gray-300 dark:border-gray-700",
          "text-gray-900 dark:text-gray-300",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "focus:ring-2 focus:ring-[#1A8F70] focus:border-transparent",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default Input;
