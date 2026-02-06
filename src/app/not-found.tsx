import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600">
        404
      </h1>
      <h2 className="text-xl text-gray-600 dark:text-gray-400">
        Page not found
      </h2>
      <Link
        href="/"
        className="mt-4 px-6 py-2 bg-[#1A8F70] text-white rounded-lg hover:bg-[#158060] transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
