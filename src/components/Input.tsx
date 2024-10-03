import { InputHTMLAttributes } from "react";

type InputProps = {
  title: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({ title, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[14px]">{title}</span>
      <input {...props} className="border py-[10px] px-[14px] rounded-md" />
    </div>
  );
};

export default Input;
