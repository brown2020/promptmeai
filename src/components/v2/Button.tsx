import { cn } from "@/utils/tailwind";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariants = "filled" | "gradient" | "outlined" | "text";

type ButtonProps = {
  variant?: ButtonVariants;
  className?: string;
} & PropsWithChildren &
  ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  variant = "filled",
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        {
          "bg-slate-800 text-white focus:bg-slate-700 active:bg-slate-700 hover:bg-slate-700 rounded-md py-2 px-4 border border-transparent text-center text-sm  transition-all shadow-md hover:shadow-lg focus:shadow-none active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none":
            variant === "filled",
          "rounded-md bg-gradient-to-tr from-slate-800 to-slate-700 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none":
            variant === "gradient",
          "rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none":
            variant === "outlined",
          "rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none":
            variant === "text",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
