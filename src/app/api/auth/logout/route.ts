import { cookies } from "next/headers";
import { sessionCookieOptions } from "@/firebase/sessionCookieOptions";

export const runtime = "nodejs";

const cookieName = () => process.env.NEXT_PUBLIC_COOKIE_NAME || "authToken";

/**
 * Expires the HttpOnly auth cookie on this response.
 *
 * Not a server action: sign-out has to work after the ID token is already
 * invalid, and this handler takes no arguments, so it cannot clear any
 * cookie except the one the browser attached to this request.
 */
export async function POST() {
  const store = await cookies();
  store.set(cookieName(), "", {
    ...sessionCookieOptions(process.env.NODE_ENV === "production"),
    maxAge: 0,
  });
  return new Response(null, { status: 204 });
}
