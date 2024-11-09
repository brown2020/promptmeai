import { providerMap, signIn } from "@/auth";
import { Button } from "@/components/buttons";
import { AuthError } from "next-auth";
import { GiBrainTentacle } from "react-icons/gi";

const SignInScreen = () => {
  return (
    <div className="w-full h-full overflow-auto bg-gradient-to-r from-teal-800 dark:from-[#272A2D] via-teal-700 dark:via-[#272A2D] to-teal-500 dark:to-[#272A2D] text-gray-800">
      <div className="grid lg:grid-cols-2 items-center gap-6 max-w-md lg:max-w-6xl w-full h-full mx-auto p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <GiBrainTentacle size={64} color="#FFFFFF" />
          <h2 className="text-4xl font-extrabold lg:leading-[50px] text-white dark:text-[#EEE]">
            Welcome to Prompt.me
          </h2>
          <p className="text-white dark:text-[#EEE]">
            This demo showcases the capabilities of Prompt.me, a powerful tool
            that allows you to run the same prompts across leading AI models
            simultaneously, including OpenAI, Anthropic, Gemini, Llama, and
            Mistral. Sign in to start exploring the differences and strengths of
            each model, or learn more about how Prompt.me can help you make
            informed decisions in your AI projects.
          </p>
        </div>

        <div className="flex flex-col justify-center h-full lg:pb-0 pb-6">
          <div className="bg-white rounded-xl px-6 py-8 space-y-6 max-w-md lg:ml-auto w-full">
            <h3 className="text-3xl font-extrabold mb-12">Sign in</h3>

            <div className="space-x-6 flex justify-center">
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
                    className="w-full py-3 px-6"
                    variant="outlined"
                  >
                    <span>Sign in with {provider.name}</span>
                  </Button>
                </form>
              ))}
            </div>

            <p className="my-6 text-sm text-gray-400 text-center">
              or continue with
            </p>

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
              Don&apos;t have an account{" "}
              <a
                href="javascript:void(0);"
                className="dark:text-[#EEE] font-semibold underline ml-1"
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;
