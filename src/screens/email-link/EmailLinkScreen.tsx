import Link from "next/link";

const EmailLinkScreen = () => {
  return (
    <div className="bg-white rounded-xl px-6 py-8 space-y-6 max-w-md lg:ml-auto w-full">
      <h3 className="text-3xl font-extrabold mb-8 text-center">Email Link</h3>

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

export default EmailLinkScreen;
