import { useAuthStore } from "@/zustand/useAuthStore";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";

const ChatProfileIcon = () => {
  const { authPhotoUrl } = useAuthStore((state) => state);

  return (
    <div className="absolute top-[8px] left-[-16px]">
      {authPhotoUrl ? (
        <Image
          src={authPhotoUrl}
          width={32}
          height={32}
          alt="Profile Picture"
          className="rounded-full shadow-sm"
        />
      ) : (
        <div className="bg-[#F9F9F9] rounded-lg w-[32px] h-[32px] flex justify-center items-center shadow-sm">
          <CgProfile className="text-[#255148]" size={16} />
        </div>
      )}
    </div>
  );
};

export default ChatProfileIcon;
