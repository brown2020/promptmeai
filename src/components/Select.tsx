import { SelectHTMLAttributes } from "react";

export type FieldOptions = {
  label: string;
  value: string;
};

type SelectProps = {
  label: string;
  options: FieldOptions[];
} & SelectHTMLAttributes<HTMLSelectElement>;

const Select = ({ label, options, ...props }: SelectProps) => {
  return (
    <div className="w-full max-w-sm min-w-[200px]">
      <label className="block mb-1 text-[14px]">{label}</label>

      <div className="relative">
        <select
          className="w-full bg-transparent dark:bg-[#4B4F5B] placeholder:text-slate-400 text-slate-700 dark:text-[#A0A7BB] border dark:border-[#4B4F5B] py-[12px] px-[14px] rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.2"
          stroke="currentColor"
          className="h-5 w-5 ml-1 absolute top-[13.5px] right-2.5 text-slate-700 dark:text-[#A0A7BB]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
          />
        </svg>
      </div>
    </div>
  );
};

export default Select;
