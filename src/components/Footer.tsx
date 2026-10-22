"use client";

import { MENU_ITEMS } from "@/constants/menuItems";
import { useAuthStore } from "@/zustand/useAuthStore";
import Link from "next/link";

export default function Footer() {
  const uid = useAuthStore((s) => s.uid);

  const menuItems = MENU_ITEMS.filter((item) => {
    if (!item.footer) return false;
    if (item.show === "everyone") return true;
    if (item.show === "guest_only") return !uid;
    if (item.show === "user_only") return Boolean(uid);
    return false;
  });

  return (
    <footer className="flex flex-wrap gap-x-3 gap-y-2 w-full min-h-14 items-center px-5 justify-center shrink-0 col-span-1 lg:col-span-2 xl:col-span-3">
      {menuItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="rounded-sm text-[#3B3B3B] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A8F70] dark:text-[#D8D8D8] dark:hover:text-white"
        >
          {item.label}
        </Link>
      ))}
    </footer>
  );
}
