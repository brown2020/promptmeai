import logo from "@/app/icon.svg";
import SupportScreen from "@/screens/support";

const SupportPage = () => {
  return (
    <SupportScreen
      companyName="Prompt.me"
      companyEmail="info@ignitechannel.com"
      companyAddress={"30765 Pacific Coast Hwy #354"}
      companyLocation={"Malibu, CA"}
      updatedAt={"September 1, 2024"}
      companyLogo={logo}
    />
  );
};

export default SupportPage;
