"use client";

import { useIsClient } from "@/hooks";
import { UserButton } from "@clerk/nextjs";

const UserProfileButton = () => {
  const isClient = useIsClient();

  if (!isClient) return;

  return <UserButton />;
};

export default UserProfileButton;
