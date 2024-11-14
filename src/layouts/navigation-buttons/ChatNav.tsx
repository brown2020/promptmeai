"use client";

import { usePathname, useRouter } from "next/navigation";
import { ButtonIcon } from "@/components/buttons";
import { PiChatsCircle } from "react-icons/pi";
import { isIOSReactNativeWebView } from "@/utils/platform";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseClient";

const ChatNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user] = useAuthState(auth);
  const isSignedIn = user?.uid;

  return (
    <ButtonIcon
      icon={PiChatsCircle}
      isActive={pathname.includes("chat")}
      onClick={() => {
        if (isSignedIn || !isIOSReactNativeWebView()) {
          router.push("/chat");
        }
      }}
    />
  );
};

export default ChatNav;
