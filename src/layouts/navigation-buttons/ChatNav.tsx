"use client";

import { usePathname, useRouter } from "next/navigation";
import { ButtonIcon } from "@/components/buttons";
import { PiChatsCircle } from "react-icons/pi";
import { useUser } from "@clerk/nextjs";
import { isIOSReactNativeWebView } from "@/utils/platform";

const ChatNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  return (
    <ButtonIcon
      icon={PiChatsCircle}
      isActive={pathname.includes("chat")}
      onClick={() => {
        console.log(isSignedIn, 'isSignedInisSignedInisSignedIn')
        if (isSignedIn || !isIOSReactNativeWebView()) {
          router.push("/chat");
        }
      }}
    />
  );
};

export default ChatNav;
