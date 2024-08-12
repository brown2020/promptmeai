"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { doc } from "firebase/firestore";
import {
  StorageReference,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/zustand/useAuthStore";
import useProfileStore from "@/zustand/useProfileStore";
import { auth, db, storage } from "@/firebase/firebaseClient";
import { resizeImage } from "@/utils/resizeImage";

type Props = {
  event?: string;
};
export default function ProfileComponent({ event = "" }: Props) {
  const uid = useAuthStore((state) => state.uid);
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const [newProfile, setNewProfile] = useState(profile);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setNewProfile(profile);
  }, [profile]);

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      const files = e.target.files;
      if (!files || !files[0]) throw new Error("No file selected");
      let storageRef: StorageReference;

      const resizedBlob = await resizeImage(files[0]);
      storageRef = ref(storage, `users/${uid}/profile.png`);
      await uploadBytesResumable(storageRef, resizedBlob);

      if (!storageRef) throw new Error("Error uploading file");

      const updatedUrl = await getDownloadURL(storageRef);
      setNewProfile({ ...newProfile, photoUrl: updatedUrl });
    } catch (error: any) {
      console.error("Error uploading file: ", error?.message);
    } finally {
      setLoading(false);
    }
  };

  const hasChanges =
    newProfile.displayName !== profile.displayName ||
    newProfile.contactEmail !== profile.contactEmail ||
    newProfile.photoUrl !== profile.photoUrl;

  const handleSubmit = async () => {
    try {
      if (!uid) throw new Error("No user found");
      const userRef = doc(db, "users", uid);
      if (!userRef) throw new Error("Error saving to Firestore");

      updateProfile({
        ...profile,
        displayName: newProfile.displayName || "",
        contactEmail: newProfile.contactEmail || "",
        photoUrl: newProfile.photoUrl || "",
      });
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row px-5 py-3 gap-3 border border-gray-500 rounded-md">
        <div className="relative w-48 aspect-square">
          {newProfile.photoUrl && (
            <Image
              width={512}
              height={512}
              src={newProfile.photoUrl}
              alt="User"
              className="object-cover rounded-md"
              priority={true}
            />
          )}
          {!newProfile.photoUrl && (
            <div className="flex h-full items-center justify-center bg-gray-300 rounded-md">
              <span>Click to upload</span>
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 rounded-md">
              <ClipLoader color="#4A90E2" />
            </div>
          )}

          <div className="absolute z-10 top-0 left-0 h-full w-full opacity-0 bg-black hover:opacity-50 cursor-pointer">
            <input
              className="opacity-0 h-full w-full"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <div className="flex flex-col gap-1">
            <div className="text-sm">{"Name"}</div>
            <input
              className="px-3 py-2 text-black border border-gray-700 rounded-md"
              type="text"
              value={newProfile.displayName}
              onChange={(e) =>
                setNewProfile({ ...newProfile, displayName: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-sm">{"Contact Email"}</div>
            <input
              className="px-3 py-2 text-black border border-gray-700 rounded-md"
              type="text"
              value={newProfile.contactEmail}
              onChange={(e) =>
                setNewProfile({ ...newProfile, contactEmail: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="btn btn-primary flex-1"
          type="button"
          disabled={!hasChanges}
          onClick={handleSubmit}
        >
          Save Changes
        </button>
      </div>

      <div className="flex flex-col sm:flex-row px-5 py-3 gap-3 border border-gray-500 rounded-md">
        <div className="flex gap-2 w-full items-center">
          <div className="flex-1">
            Conversation Credits: {Math.round(profile.credits)}
          </div>
          <div className="flex-1">
            <Link className="btn-primary" href={"/payment-attempt"}>
              Buy 10,000 Credits
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
