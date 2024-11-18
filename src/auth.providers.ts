import { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";

export const OAuthProviders: Provider[] = [Google];

export const providerMap = OAuthProviders.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
}).filter((provider) => provider.id !== "credentials");
