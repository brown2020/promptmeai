import TermsSection1 from "./terms/TermsSection1";
import TermsSection2 from "./terms/TermsSection2";
import TermsSection3 from "./terms/TermsSection3";
import TermsSection4 from "./terms/TermsSection4";
import TermsSection5 from "./terms/TermsSection5";
import TermsSection6 from "./terms/TermsSection6";

type Props = {
  companyName: string;
  companyEmail: string;
  privacyLink: string;
  updatedAt: string;
};

export default function TermsContent({
  companyName,
  companyEmail,
  privacyLink,
  updatedAt,
}: Props) {
  return (
    <div className="text-wrapper">
      <TermsSection1 companyName={companyName} companyEmail={companyEmail} privacyLink={privacyLink} updatedAt={updatedAt} />
      <TermsSection2 companyName={companyName} companyEmail={companyEmail} privacyLink={privacyLink} updatedAt={updatedAt} />
      <TermsSection3 companyName={companyName} companyEmail={companyEmail} privacyLink={privacyLink} updatedAt={updatedAt} />
      <TermsSection4 companyName={companyName} companyEmail={companyEmail} privacyLink={privacyLink} updatedAt={updatedAt} />
      <TermsSection5 companyName={companyName} companyEmail={companyEmail} privacyLink={privacyLink} updatedAt={updatedAt} />
      <TermsSection6 companyName={companyName} companyEmail={companyEmail} privacyLink={privacyLink} updatedAt={updatedAt} />
    </div>
  );
}
