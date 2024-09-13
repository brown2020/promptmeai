import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/v2/chat");
}
