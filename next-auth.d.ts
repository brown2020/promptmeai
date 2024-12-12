import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    firebaseToken?: string;
    user: DefaultSession["user"];
  }
}
