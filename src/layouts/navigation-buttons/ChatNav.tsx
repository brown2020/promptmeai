"use client";

import { usePathname, useRouter } from "next/navigation";
import { ButtonIcon } from "@/components/buttons";
import { PiChatsCircle } from "react-icons/pi";

const ChatNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <ButtonIcon
      icon={PiChatsCircle}
      isActive={pathname.includes("chat")}
      onClick={() => router.push("/chat")}
    />
  );
};

export default ChatNav;
