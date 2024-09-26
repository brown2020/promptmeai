import { ReactNode } from "react";

type TableProps<T> = {
  data: T[];
  headers: {
    key: keyof T;
    label: string;
    render?: (item: T[keyof T], row: T) => React.ReactNode;
  }[];
};

const Table = <T extends object>({ data, headers }: TableProps<T>) => {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {headers.map((header) => (
              <th key={String(header.key)} scope="col" className="px-6 py-3">
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
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
