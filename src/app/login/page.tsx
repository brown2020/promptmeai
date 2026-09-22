import type { Metadata } from "next";
import { AuthPageForm } from "@/components/auth/AuthPageForm";
import GreenWhiteLayout from "@/layouts/GreenWhiteLayout";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function AuthRoutePage() {
  return (
    <GreenWhiteLayout>
      <div className="flex min-h-screen flex-1 items-center justify-center px-4 py-10">
        <AuthPageForm mode="login" />
      </div>
    </GreenWhiteLayout>
  );
}
