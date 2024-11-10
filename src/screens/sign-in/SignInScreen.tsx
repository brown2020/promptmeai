import { providerMap, signIn } from "@/auth";
import { Button } from "@/components/buttons";
import { AuthError } from "next-auth";
import Image from "next/image";
import { GiBrainTentacle } from "react-icons/gi";

const SignInScreen = () => {
  return (
    <div className="bg-white rounded-xl px-6 py-8 space-y-6 max-w-md lg:ml-auto w-full">
      <h3 className="text-3xl font-extrabold mb-12">Sign in</h3>

      <div className="flex flex-col gap-4 justify-center">
        {Object.values(providerMap).map((provider) => (
          <form
            key={provider.id}
            action={async () => {
              "use server";
              try {
                await signIn(provider.id);
              } catch (error) {
                // Signin can fail for a number of reasons, such as the user
                // not existing, or the user not having the correct role.
                // In some cases, you may want to redirect to a custom error
                if (error instanceof AuthError) {
                  // return redirect(
                  //   `${SIGNIN_ERROR_URL}?error=${error.type}`
                  // );
                }

                // Otherwise if a redirects happens Next.js can handle it
                // so you can just re-thrown the error and let Next.js handle it.
                // Docs:
                // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                throw error;
              }
            }}
            className="w-full"
          >
            <Button
              type="submit"
              className="w-full py-3 px-6 flex justify-between items-center"
              variant="outlined"
            >
              <span>Continue with {provider.name}</span>
              <Image
                src={`https://authjs.dev/img/providers/${provider.id}.svg`}
                alt={`Oauth ${provider.id}`}
                width={24}
                height={24}
              />
            </Button>
          </form>
        ))}
      </div>

      <p className="my-6 text-sm text-gray-400 text-center">or continue with</p>

      <form className="space-y-6">
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
        <div className="text-sm text-right">
          <a
            href="jajvascript:void(0);"
            className="text-blue-600 font-semibold hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <button
          type="button"
          className="w-full shadow-xl py-3 px-6 text-sm font-semibold rounded-md text-white dark:text-[#EEE] bg-gray-800 hover:bg-[#222] focus:outline-none"
        >
          Log in
        </button>
      </form>

      <p className="dark:text-[#EEE] text-center">
        Don&apos;t have an account
        <span className="dark:text-[#EEE] font-semibold underline ml-1 cursor-pointer">
          Register here
        </span>
      </p>
    </div>
  );
};

export default SignInScreen;
