"use server";

import { signIn } from "next-auth/react";

export async function handleOAuthSignIn(providerId: string) {
  try {
    await signIn(providerId);
  } catch (error) {
    console.error("OAuth sign in error:", error);
  }
}
