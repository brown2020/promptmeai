import { ReactNode } from "react";

type TableProps<T> = {
  data: T[];
  headers: {
    key: keyof T;
    label: string;
    render?: (item: T[keyof T], row: T) => React.ReactNode;
  }[];
  label: string;
  emptyMessage: string;
};

const Table = <T extends object>({ data, headers, label, emptyMessage }: TableProps<T>) => {
  return (
    <div
      className="relative overflow-x-auto rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A8F70]"
      role="region"
      aria-label={label}
      tabIndex={0}
    >
      <table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-200">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-100">
          <tr>
            {headers.map((header) => (
              <th key={String(header.key)} scope="col" className="px-6 py-3">
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr className="bg-white dark:bg-gray-800">
              <td colSpan={headers.length} className="px-6 py-4 text-center">
                {emptyMessage}
              </td>
            </tr>
          )}
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              {headers.map((header) => (
                <td key={String(header.key)} className="px-6 py-4">
                  {header.render
                    ? header.render(row[header.key], row)
                    : (row[header.key] as ReactNode) ?? String(row[header.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
