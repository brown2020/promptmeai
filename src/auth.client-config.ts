import type { NextAuthConfig } from "next-auth";

const protectedUrls = ["/chat", "/settings"];
const authUrls = [
  "/api/auth/signin",
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/complete-signin",
];

export default {
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedUrl = protectedUrls.some((url) =>
        nextUrl.pathname.startsWith(url)
      );
      const isAuthUrl = authUrls.some((url) =>
        nextUrl.pathname.startsWith(url)
      );

      if (isProtectedUrl) {
        // Allow access if logged in
        if (isLoggedIn) return true;

        // Redirect unauthenticated users to the login page
        return false;
      }

      // If not a protected URL and user is logged in, redirect to a default page (e.g., '/chat')
      if (isLoggedIn && isAuthUrl) {
        return Response.redirect(new URL("/chat", nextUrl));
      }

      // Allow access to other routes
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
