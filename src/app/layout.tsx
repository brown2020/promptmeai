import Layout from "@/layouts/Layout";
import { Toaster } from "react-hot-toast";

import "@/styles/globals.css";
import Providers from "@/providers";

export const metadata = {
  title: "Prompt.me",
  description: "Compare chatbot models",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
