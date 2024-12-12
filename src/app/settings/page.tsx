import { auth } from "@/auth";
import SettingsScreen from "@/screens/settings";

const SettingsPage = async () => {
  const session = await auth();

  return <SettingsScreen userId={session?.user?.id || ""} />;
};

export default SettingsPage;
