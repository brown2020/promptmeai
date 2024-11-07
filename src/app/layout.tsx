import Layout from "@/layouts/Layout";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

import "@/styles/globals.css";
import { auth } from "@/auth";
import {
  fetchUsersByAuthEmail,
  moveCollection,
  moveDocumentWithoutFields,
} from "@/utils/migration";

export const metadata = {
  title: "Prompt.me",
  description: "Compare chatbot models",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await auth();

  // console.log("session", session);

  // const foundUsers = await fetchUsersByAuthEmail("real.risman@gmail.com");

  // if (session?.user?.id && foundUsers.length > 0) {
  //   const oldId = foundUsers[0].id;
  //   const newId = session.user.id;

  //   await moveDocumentWithoutFields(
  //     `users/${oldId}/profile/userData`,
  //     `users/${newId}`,
  //     ["contactEmail", "displayName", "email", "emailVerified", "photoUrl"]
  //   );

  //   await moveCollection(
  //     `users/${oldId}/payments`,
  //     `payments/${newId}/transactions`
  //   );

  //   await moveCollection(
  //     `promptme_chats/${oldId}/chat`,
  //     `promptme_chats/${newId}/chats`
  //   );
  // }

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
