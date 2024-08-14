"use client";

import { useAuthStore } from "@/zustand/useAuthStore";
import Image from "next/image";
import Link from "next/link";

type Props = {};

export default function HomePage({}: Props) {
  const uid = useAuthStore((state) => state.uid);
  const firebaseUid = useAuthStore((state) => state.firebaseUid);
  const photoUrl = useAuthStore((state) => state.authPhotoUrl);
  const fullName = useAuthStore((state) => state.authDisplayName);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-5">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <div className="text-2xl font-bold mb-4 text-center">Prompt.me</div>
        <div className="flex flex-col items-center mb-4">
          {/* User Avatar */}
          {photoUrl ? (
            <Image
              width={150}
              height={150}
              src={photoUrl}
              alt="User Avatar"
              className="w-24 h-24 rounded-full mb-2"
            />
          ) : (
            <div className="flex items-center justify-center text-white bg-blue-500 w-24 h-24 rounded-full mb-2">
              {fullName?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          <div className="text-lg font-medium">
            Clerk User: {uid || "No User"}
          </div>
          {firebaseUid ? (
            <div className="text-lg font-medium">
              Firebase User: {firebaseUid}
            </div>
          ) : (
            <div className="text-lg font-medium text-red-600">
              Not Logged Into Firebase
            </div>
          )}
        </div>

        <div className="flex justify-around">
          {firebaseUid && (
            <Link
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-32 text-center"
              href="/chat-compare"
            >
              Chat Compare
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
