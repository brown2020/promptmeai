import LeftPanel from "@/layouts/LeftPanel";
import RowLayout from "@/layouts/RowLayout";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <RowLayout>
            <LeftPanel />
            {children}
          </RowLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
