"use client";

import { usePathname, useRouter } from "next/navigation";
import { ButtonIcon } from "@/components/buttons";
import { PiChatsCircle } from "react-icons/pi";
import { usePlatform } from "@/zustand/usePlatformStore";
import { useAuthStore } from "@/zustand/useAuthStore";

const ChatNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const uid = useAuthStore((s) => s.uid);
  const { isRNWebView } = usePlatform();

  return (
    <ButtonIcon
      icon={PiChatsCircle}
      aria-label="Open chat"
      isActive={pathname.includes("chat")}
      onClick={() => {
        if (uid || !isRNWebView) {
          router.push("/chat");
        }
      }}
    />
  );
};

export default ChatNav;
