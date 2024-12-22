"use client";

import { handleOAuthSignIn } from "@/actions/auth";
import { Button } from "./buttons";
import Image from "next/image";
import { providerMap } from "@/auth.providers";
import { SiMinutemailer } from "react-icons/si";
import Link from "next/link";

const OAuthList = () => {
  return (
    <div className="flex flex-col gap-4 justify-center">
      {Object.values(providerMap).map((provider) => (
        <form
          key={provider.id}
          action={() => handleOAuthSignIn(provider.id)}
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
      <Link href="/auth/email-link">
        <Button
          className="w-full py-3 px-6 flex justify-between items-center"
          variant="outlined"
        >
          Continue with Email Link
          <SiMinutemailer size={24} />
        </Button>
      </Link>
    </div>
  );
};

export default OAuthList;
