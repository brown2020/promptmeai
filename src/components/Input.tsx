import { InputHTMLAttributes } from "react";

type InputProps = {
  title: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({ title, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[16px]">{title}</span>
      <input
        {...props}
        className="dark:bg-[#4B4F5B] border dark:border-[#4B4F5B] dark:text-[#A0A7BB] dark:outline-hidden py-[10px] px-[14px] rounded-md"
      />
    </div>
  );
};

export default Input;
