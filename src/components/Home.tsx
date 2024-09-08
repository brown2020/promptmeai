"use client";

import { useAuthStore } from "@/zustand/useAuthStore";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const uid = useAuthStore((state) => state.uid);
  const photoUrl = useAuthStore((state) => state.authPhotoUrl);
  const firebaseUid = useAuthStore((state) => state.firebaseUid);
  const fullName = useAuthStore((state) => state.authDisplayName);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col gap-5 bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <div className="text-2xl font-bold text-center">Prompt.me</div>

        <SignedIn>
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              {photoUrl && (
                <Image
                  src={photoUrl}
                  width={256}
                  height={256}
                  alt={"user"}
                  priority
                />
              )}
            </div>
            <div>{fullName}</div>

            <div className="w-full">
              <div className="text-lg font-medium">Clerk User</div>
              <div className="text-sm py-1 px-2 bg-slate-100 rounded-md">
                {uid || "No User"}
              </div>
            </div>

            <div className="w-full">
              <div className="text-lg font-medium">Firebase User</div>
              <div className="text-sm py-1 px-2 bg-slate-100 rounded-md">
                {firebaseUid || "No User"}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            {firebaseUid && (
              <div className="p-2 bg-blue-500 text-white rounded-md w-32 text-center">
                <Link href="/chat-compare">Chat Compare</Link>
              </div>
            )}
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex flex-col items-center mb-4">
            <div className="text-lg font-medium text-gray-700 mb-2 text-center">
              Welcome to Prompt.me!
            </div>
            <div className="text-sm text-gray-600 text-center">
              This demo showcases the capabilities of Prompt.me, a powerful tool
              that allows you to run the same prompts across leading AI models
              simultaneously, including OpenAI, Anthropic, Gemini, Llama, and
              Mistral. Sign in to start exploring the differences and strengths
              of each model, or learn more about how Prompt.me can help you make
              informed decisions in your AI projects.
            </div>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}
