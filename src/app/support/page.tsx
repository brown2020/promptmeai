import logo from "@/app/icon.svg";
import SupportPage from "@/components/SupportPage";

export default function page() {
  return (
    <SupportPage
      companyName="Prompt.me"
      companyEmail="info@ignitechannel.com"
      companyAddress={"30765 Pacific Coast Hwy #354"}
      companyLocation={"Malibu, CA"}
      updatedAt={"September 1, 2024"}
      companyLogo={logo}
    />
  );
}
