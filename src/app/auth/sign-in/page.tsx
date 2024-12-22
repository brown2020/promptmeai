// Mark this as a server component explicitly
export const dynamic = "force-dynamic";

import SignInScreen from "@/screens/sign-in";

export default function SignInPage() {
  return (
    <div suppressHydrationWarning>
      <SignInScreen />
    </div>
  );
}
