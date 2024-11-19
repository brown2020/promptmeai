"use client";

import { MENU_ITEMS } from "@/constants/menuItems";

import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex flex-wrap space-x-2 w-full h-14 items-center px-5 justify-center flex-shrink-0 col-span-1 lg:col-span-2 xl:col-span-3">
      {MENU_ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="text-black/50 hover:text-black/100"
        >
          <div>{item.label}</div>
        </Link>
      ))}
    </div>
  );
}
