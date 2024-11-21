"use client";

import {
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { User as UserType } from "next-auth";
import Image from "next/image";
import { FaUserAstronaut } from "react-icons/fa";
import { useWindowSize } from "react-use";
import ThemeSwitcher from "./ThemeSwitcher";
import { useState } from "react";

type UserProfileButtonProps = {
  user?: UserType;
};

const UserProfileButton = ({ user }: UserProfileButtonProps) => {
  const { width } = useWindowSize();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsDropdownOpen(open);
  };

  return (
    <Dropdown isOpen={isDropdownOpen} onOpenChange={handleOpenChange}>
      <DropdownTrigger>
        {user?.image ? (
          <Image
            src={user?.image}
            width="32"
            height="32"
            alt="Profile Image"
            className={cn(
              "cursor-pointer rounded-full hover:outline hover:outline-2 hover:outline-[#0CA37F]",
              {
                "outline outline-2 outline-[#0CA37F]": isDropdownOpen,
              }
            )}
          />
        ) : (
          <FaUserAstronaut
            size={24}
            color="#255148"
            className="cursor-pointer"
          />
        )}
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile menu list"
        itemClasses={{
          base: [
            "rounded-md",
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "data-[hover=true]:bg-default-100",
            "dark:data-[hover=true]:bg-default-50",
            "data-[selectable=true]:focus:bg-default-50",
            "data-[pressed=true]:opacity-70",
            "data-[focus-visible=true]:ring-default-500",
          ],
        }}
      >
        <DropdownSection
          aria-label="Profile & Actions"
          showDivider={width < 640}
        >
          <DropdownItem
            isReadOnly
            key="profile"
            className="h-14 gap-2 opacity-100"
          >
            <User
              name={user?.name || ""}
              classNames={{
                name: "text-default-600",
                description: "text-default-500",
              }}
              avatarProps={{
                size: "sm",
                src: user?.image || "",
              }}
            />
          </DropdownItem>

          <DropdownItem key="manage-account">Manage Account</DropdownItem>

          <DropdownItem
            isReadOnly
            key="theme"
            className="cursor-default flex sm:hidden"
            endContent={<ThemeSwitcher />}
          >
            Theme
          </DropdownItem>
        </DropdownSection>
        <DropdownSection aria-label="Profile & Actions">
          <DropdownItem key="logout">Log Out</DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserProfileButton;
