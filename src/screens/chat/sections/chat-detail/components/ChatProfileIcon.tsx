import { useSession } from "next-auth/react";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";

const ChatProfileIcon = () => {
  const { data: session } = useSession();

  return (
    <div className="absolute top-[8px] left-[-16px]">
      {session?.user?.image ? (
        <Image
          src={session?.user?.image}
          width={32}
          height={32}
          alt="Profile Picture"
          className="rounded-full shadow"
        />
      ) : (
        <div className="bg-[#F9F9F9] rounded-lg w-[32px] h-[32px] flex justify-center items-center shadow">
          <CgProfile className="text-[#255148]" size={16} />
        </div>
      )}
    </div>
  );
};

export default ChatProfileIcon;
