"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

type AuthResult = {
  success: boolean; // Indicates if the action was successful
  message?: string; // Contains an error message if applicable
};

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

export async function authenticateAccountRegister(
  prevState: AuthResult | undefined,
  formData: FormData
): Promise<AuthResult> {
  try {
    await signIn("account-register", formData);
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.cause?.err instanceof Error) {
        return { success: false, message: error.cause.err.message };
      }
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid credentials" };
        default:
          return { success: false, message: "Something went wrong" };
      }
    }
    throw error; // Re-throw non-AuthError cases
  }
}
