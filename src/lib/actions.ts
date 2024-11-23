"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticateLoginPassword(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("login-password", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.cause?.err instanceof Error) {
        return error.cause.err.message; // return "custom error"
      }
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials";
        default:
          return "Something went wrong";
      }
    }
    throw error;
  }
}
