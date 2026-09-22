type Props = {
  companyName: string;
  companyEmail: string;
  privacyLink: string;
  updatedAt: string;
};

export default function TermsSection6({
  companyName,
  companyEmail,
  privacyLink,
  updatedAt,
}: Props) {
  return (
    <>
<h4>Modification of the Terms and Services</h4>
      <p>
        {companyName} reserves the right to update this Agreement and/or the
        Privacy Policy at any time and for any reason in its sole discretion by
        posting updated terms. Unless otherwise indicated by
        {companyName}, any changes will become effective on a prospective basis
        from the date of posting. {companyName} will notify you of any material
        changes to the Agreement or Services. By continuing to access or use the
        Services after we have provided you with notice of a modification, you
        are agreeing to be bound by the modified Agreement. If the modified
        Agreement is not acceptable to you, your only recourse is to cease using
        the Services. {companyName} and its third-party service providers may
        make improvements and/or changes in the Services, features, and prices
        described at any time and for any reason in its sole discretion. The
        Mobile Apps may download and install upgrades, updates, and additional
        features in order to improve, enhance, and further develop the Services.{" "}
        {companyName} reserves the right at any time to modify or discontinue,
        temporarily or permanently, the Services or any portion thereof with or
        without notice. You agree that
        {companyName} shall not be liable to you or to any third party for any
        modification, suspension, or discontinuance of the Services.
      </p>
      <h5>Last Updated: {updatedAt}</h5>
    
    </>
  );
}
