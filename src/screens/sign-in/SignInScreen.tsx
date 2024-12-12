import OAuthList from "@/components/OAuthList";
import Link from "next/link";
import SignInForm from "./SigInForm";

const SignInScreen = () => {
  return (
    <div className="bg-white rounded-xl px-6 py-8 space-y-6 max-w-md lg:ml-auto w-full">
      <h3 className="text-3xl font-extrabold mb-8 text-center">Sign in</h3>

      <OAuthList />

      <p className="my-6 text-sm text-gray-400 text-center">or continue with</p>

      <SignInForm />

      <p className="text-center">
        Don&apos;t have an account?
        <Link
          href="/auth/sign-up"
          className="font-semibold underline ml-1 cursor-pointer"
        >
          Register here
        </Link>
      </p>
    </div>
  );
};

export default SignInScreen;
