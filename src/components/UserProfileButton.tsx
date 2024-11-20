"use client";

import { User } from "next-auth";
import Image from "next/image";
import { FaUserAstronaut } from "react-icons/fa";

type UserProfileButtonProps = {
  user?: User;
};

const UserProfileButton = ({ user }: UserProfileButtonProps) => {
  return user && user?.image ? (
    <Image
      src={user?.image}
      width="28"
      height="28"
      alt="Profile Image"
      className="cursor-pointer rounded-full hover:border hover:border-neutral-300"
    />
  ) : (
    <FaUserAstronaut size={24} color="#255148" className="cursor-pointer" />
  );
};

export default UserProfileButton;
