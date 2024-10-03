import HomeScreen from "@/screens/home";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const HomePage = () => {
  const { userId } = auth();

  if (userId) {
    return redirect("/chat");
  }

  return <HomeScreen />;
};

export default HomePage;
