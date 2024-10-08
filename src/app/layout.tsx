import Layout from "@/layouts/Layout";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";

import "@/styles/globals.css";

export const metadata = {
  title: "Prompt.me",
  description: "Compare chatbot models",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Providers>
            <Layout>{children}</Layout>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
