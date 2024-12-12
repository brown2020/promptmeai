import NextAuth from "next-auth";
import authClientConfig from "./auth.client-config";

export default NextAuth(authClientConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
