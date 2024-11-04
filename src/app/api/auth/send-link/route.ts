import { auth } from "@/firebase/firebaseClient";
import { sendSignInLinkToEmail } from "firebase/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const actionCodeSettings = {
    url: `${process.env.AUTH_URL}/auth/complete-signin`,
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    return NextResponse.json({
      message: "Sign-in link sent!",
    });
  } catch (error) {
    console.error("Error sending sign-in link", error);
    return NextResponse.json(
      { message: "Failed to send sign-in link" },
      { status: 500 }
    );
  }
}
