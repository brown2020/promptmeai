import OAuthList from "@/components/OAuthList";

const SignUpScreen = () => {
  return (
    <div className="bg-white rounded-xl px-6 py-8 space-y-6 max-w-md lg:ml-auto w-full">
      <h3 className="text-3xl font-extrabold mb-12">Sign up</h3>

      <OAuthList />

      <p className="my-6 text-sm text-gray-400 text-center">or continue with</p>

      <form className="space-y-6">
        <input
          name="name"
          type="string"
          autoComplete="name"
          required
          className="bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800"
          placeholder="Full name"
        />
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800"
          placeholder="Email address"
        />
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800"
          placeholder="Password"
        />
        <button
          type="button"
          className="w-full shadow-xl py-3 px-6 text-sm font-semibold rounded-md text-white dark:text-[#EEE] bg-gray-800 hover:bg-[#222] focus:outline-none"
        >
          Sign up
        </button>
      </form>

      <p className="dark:text-[#EEE] text-center">
        Already have an account
        <span className="dark:text-[#EEE] font-semibold underline ml-1 cursor-pointer">
          Sign in here
        </span>
      </p>
    </div>
  );
};

export default SignUpScreen;
