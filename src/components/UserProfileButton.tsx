"use client";

import {
  Avatar,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { User as UserType } from "next-auth";
import { useWindowSize } from "react-use";
import ThemeSwitcher from "./ThemeSwitcher";
import { useState } from "react";
import { ManageProfile } from "./modals";
import { signOut } from "next-auth/react";
import { auth } from "@/firebase/firebaseClient";

type UserProfileButtonProps = {
  user?: UserType;
};

const UserProfileButton = ({ user }: UserProfileButtonProps) => {
  const { width } = useWindowSize();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [openManageProfile, setOpenManageProfile] = useState<boolean>(false);

  const handleOpenChange = (open: boolean) => {
    if (!user) return;

    setIsDropdownOpen(open);
  };

  const dropdownHandler = (key: React.Key) => {
    switch (key) {
      case "manage-profile": {
        setOpenManageProfile(true);
      }
      case "logout": {
        signOut();
        auth.signOut();
      }
    }
  };

  return (
    <>
      <Dropdown isOpen={isDropdownOpen} onOpenChange={handleOpenChange}>
        <DropdownTrigger>
          <Avatar
            size="sm"
            src={user?.image || ""}
            showFallback
            className={cn("cursor-pointer", {
              "outline outline-2 outline-[#0CA37F]": isDropdownOpen,
            })}
          />
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
          onAction={dropdownHandler}
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
                  showFallback: true,
                }}
              />
            </DropdownItem>

            <DropdownItem key="manage-profile">Manage Profile</DropdownItem>

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

      <ManageProfile
        user={user}
        isOpen={openManageProfile}
        onClose={() => setOpenManageProfile(false)}
      />
    </>
  );
};

export default UserProfileButton;
