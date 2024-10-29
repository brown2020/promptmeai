"use client";

import { usePathname, useRouter } from "next/navigation";
import { ButtonIcon } from "@/components/buttons";
import { PiChatsCircle } from "react-icons/pi";
import { isIOSReactNativeWebView } from "@/utils/platform";
import { useAuthStore } from "@/zustand/useAuthStore";

const ChatNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const uid = useAuthStore((state) => state.uid);

  return (
    <ButtonIcon
      icon={PiChatsCircle}
      isActive={pathname.includes("chat")}
      onClick={() => {
        if (uid || !isIOSReactNativeWebView()) {
          router.push("/chat");
        }
      }}
    />
  );
};

export default ChatNav;
