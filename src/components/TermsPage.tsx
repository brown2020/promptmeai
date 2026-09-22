import TermsContent from "./TermsContent";

type Props = {
  companyName: string;
  companyEmail: string;
  privacyLink: string;
  updatedAt: string;
};

const TermsPage = (props: Props) => {
  return <TermsContent {...props} />;
};

export default TermsPage;
