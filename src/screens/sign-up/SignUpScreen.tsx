import OAuthList from "@/components/OAuthList";
import Link from "next/link";
import SignUpForm from "./SignUpForm";

const SignUpScreen = () => {
  return (
    <div className="bg-white rounded-xl px-6 py-8 space-y-6 max-w-md lg:ml-auto w-full">
      <h3 className="text-3xl font-extrabold mb-12">Sign up</h3>

      <OAuthList />

      <p className="my-6 text-sm text-gray-400 text-center">or continue with</p>

      <SignUpForm />

      <p className="text-center">
        Already have an account?
        <Link
          href="/auth/sign-in"
          className="font-semibold underline ml-1 cursor-pointer"
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
};

export default SignUpScreen;
