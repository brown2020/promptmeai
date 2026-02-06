import type { Metadata } from "next";
import Layout from "@/layouts/Layout";
import { Providers } from "./providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Prompt.me",
  description: "Compare chatbot models",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
