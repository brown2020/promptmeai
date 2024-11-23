import Layout from "@/layouts/Layout";
import { Toaster } from "react-hot-toast";

import "@/styles/globals.css";
import Providers from "@/providers";
import { auth } from "@/auth";

export const metadata = {
  title: "Prompt.me",
  description: "Compare chatbot models",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <Toaster
          toastOptions={{
            style: {
              padding: "12px 16px",
              width: "auto",
              maxWidth: "90%",
              whiteSpace: "nowrap",
              borderRadius: "8px",
            },
          }}
        />
        <Providers>
          <Layout user={session?.user}>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
