import TermsScreen from "@/screens/terms";

const TermsPage = () => {
  return (
    <TermsScreen
      companyName="Prompt.me"
      companyEmail="info@ignitechannel.com"
      updatedAt={"September 1, 2024"}
      privacyLink={"/privacy"}
    />
  );
};

export default TermsPage;
