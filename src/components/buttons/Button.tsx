import { cn } from "@/utils/tailwind";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariants = "filled" | "gradient" | "outlined" | "text";

type ButtonProps = {
  variant?: ButtonVariants;
  className?: string;
} & PropsWithChildren &
  ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Reusable button component with multiple variants.
 * Uses brand primary color (#1A8F70) for consistent styling.
 */
const Button = ({
  variant = "filled",
  className,
  children,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "rounded-md py-2 px-4 text-center text-sm transition-all disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    filled:
      "bg-[#1A8F70] text-white hover:bg-[#158060] active:bg-[#158060] shadow-md hover:shadow-lg focus:shadow-none",
    gradient:
      "bg-gradient-to-tr from-[#1A8F70] to-[#24C69E] text-white shadow-md hover:shadow-lg hover:opacity-90",
    outlined:
      "border border-[#1A8F70] text-[#1A8F70] hover:bg-[#1A8F70] hover:text-white shadow-sm hover:shadow-md",
    text: "text-[#1A8F70] hover:bg-[#1A8F70]/10 focus:bg-[#1A8F70]/10",
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
