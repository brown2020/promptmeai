import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatCompare",
  description: "Compare chatbot models",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
