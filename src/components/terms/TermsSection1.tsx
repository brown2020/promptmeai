type Props = {
  companyName: string;
  companyEmail: string;
  privacyLink: string;
  updatedAt: string;
};

export default function TermsSection1({
  companyName,
  companyEmail,
  privacyLink,
  updatedAt,
}: Props) {
  return (
    <>

      <h3>Terms of Service</h3>

      <p>
        Welcome and thank you for your interest in {companyName} services and
        mobile apps! These Terms of Use (the “Agreement”) describe the terms and
        conditions applicable to your use of {companyName} (the “Sites”) and the
        related mobile applications (the “Mobile Apps”) (collectively, the
        “Services”). The Sites and Mobile Apps are owned and operated by{" "}
        {companyName}, and its affiliates and subsidiaries (collectively “
        {companyName}”).
      </p>
      <p>
        In this Agreement, we refer to ourselves as {companyName} or “us” or
        “we”; we refer to you as “you” or “Customer.” {companyName} and Customer
        are referred to in this Agreement individually as a “Party” and
        collectively as the “Parties.”
      </p>
      <p>
        By accessing or using the Services, including access to the Sites, you
        intend and expressly agree to be bound by all the terms and conditions
        of this Agreement and the Privacy Policy (available at {privacyLink}),
        which is incorporated by reference. If you do not agree to these terms
        and conditions, you may not use the Services.
      </p>
      <h4>Access and Use</h4>
      <p>
        {companyName} grants you a limited license to access the Sites subject
        to this Agreement. If you choose to subscribe to and use the Mobile
        Apps, {companyName} further grants you a license to access and use the
        Services, subject to and conditioned upon your compliance with this
        Agreement, the Privacy Policy, and any other rules and requirements
        communicated to you by {companyName}, including your payment of any
        applicable fees. You acknowledge and agree that
        {companyName} may modify, update, and otherwise change the Services at
        any time and in its sole discretion.
      </p>
      <p>
        You represent and warrant that you are at least 18 years of age and have
        the legal authority to accept this Agreement on your behalf or on behalf
        of any party you represent. You alone are responsible for your
        activities and interaction with the Services.
      </p>
      <p>
        You shall not use the Services for any purposes beyond the scope of the
        access granted in this Agreement. You shall not at any time, directly or
        indirectly, and shall not permit any third-party to: (i) copy, modify,
        or create derivative works of the Services, in whole or in part; (ii)
        reverse engineer, disassemble, decompile, decode, adapt, or otherwise
        attempt to derive or gain access to any Mobile Apps component of the
        Services, in whole or in part; or (iii) use the Services in any manner
        or for any purpose that infringes, misappropriates, or otherwise
        violates any intellectual property right or other right of any person
        (including but not limited to web scraping), or that otherwise violates
        any law, regulation, or other legal requirement.
      </p>
      <p>
        Except for the limited license to access the Sites and Mobile Apps
        identified above, you acknowledge that nothing contained in this
        Agreement shall be construed as granting or conferring, by implication,
        estoppel, or otherwise, any right, title, or interest to any
        intellectual property, including any (i) inventions (whether patentable
        or not in any country), patents, patent applications, invention
        disclosures, improvements, trade secrets, proprietary information, know
        how, information, or technical data; (ii) copyright protected works,
        copyright registrations, mask works, mask work registrations, or
        applications in the United States or any foreign country; (iii)
        trademarks, trademark registrations, service marks, logos, or
        applications therefor in the United States or any foreign country; (iv)
        trade secrets; or (v) any other tangible or intangible proprietary
        rights anywhere in the world.
      </p>
      <p>
        You acknowledge and agree that at times the Services may be inaccessible
        or inoperable for any reason whatsoever, including, without limitation:
        (i) equipment malfunctions; (ii) periodic maintenance procedures or
        repairs which {companyName} may undertake from time to time without
        notice to you; or (iii) causes which are beyond the control of
        {companyName} or which are not reasonably foreseeable.
      </p>
      <p>
        Notwithstanding anything to the contrary in this Agreement,
        {companyName} may temporarily suspend access to the Services provided to
        you and any other third-party for security purposes, to prevent illegal
        or fraudulent activity, to comply with the requests of any legal agency
        or government entity, or if you violate the Agreement or the Privacy
        Policy.
      </p>
      <p>
        {companyName} may from time to time and in its sole discretion engage
        other service providers to assist in the performance of the Services,
        such as web hosting providers, payment processors, and other
        third-parties. You shall abide by the terms of use and other
        requirements associated with the services provided by such third-parties
        in connection with the Services.
      </p>
      <h4>Customer Responsibilities</h4>
      <p>
        You acknowledge that you are solely responsible and liable for your use
        of the Services, directly or indirectly, including understanding whether
        such access or use is permitted by or in violation of this Agreement.
        You are further solely responsible for compliance with all applicable
        laws relating to your use of the Services. You shall further use the
        Services solely for lawful purposes, and shall conduct all business
        through the Services in accordance with all applicable laws and
        regulations, including but not limited to all applicable federal and
        state laws and regulations governing the offer and sale of securities,
        money laundering, and counter-terrorism.
      </p>
      <p>
        You alone are responsible for ensuring and maintaining that you are able
        to access and use the Services, including by securing your own
        compatible hardware, Mobile Apps, internet access, security Mobile Apps,
        backup devices or services, and any other requirements.
        {companyName} shall have no responsibility to provide any additional
        Mobile Apps or hardware. You further agree that
        {companyName} shall have no responsibility for any data loss or other
        damage or loss suffered in connection with your use of the Services,
        including any failure to provide adequate security or backup devices or
        services.
      </p>
      <p>
        You are responsible for ensuring {companyName} has accurate and current
        information for your Customer account, including current contact and
        payment information. You are further responsible for regularly reviewing
        the associated Customer email account for any communications from{" "}
        {companyName}.
      </p>
      <p>
        If you are provided with a username, password, credentials file, or any
        other piece of information as part of any security procedure
        (“Credentials”), you must treat such information as confidential, and
        must not disclose Credentials to any other person or entity. You
        acknowledge that your account and Credentials are personal to you, and
        further agree not to provide any other person with access to the
        Services or portions of the Services using your username, password, or
        other security information. You shall notify {companyName}
        immediately of any unauthorized access to or use of your Credentials or
        any other breach of security. {companyName} has the right to disable any
        username, password, credentials file, or other identifier at any time,
        whether chosen by you or provided by {companyName}.
      </p>
      <p>
        {companyName} shall make commercially reasonable efforts to provide
        adequate support services for the Services. Notwithstanding the
        foregoing, this Agreement does not entitle you to any guaranteed level,
        availability, or turnaround time of support services for the Services.
      </p>
      
    </>
  );
}
