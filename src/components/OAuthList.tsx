import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { Button } from "./buttons";
import Image from "next/image";
import { providerMap } from "@/auth.config";

const OAuthList = () => {
  return (
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
              alt={`OAuth ${provider.id}`}
              width={24}
              height={24}
            />
          </Button>
        </form>
      ))}
    </div>
  );
};

export default OAuthList;
