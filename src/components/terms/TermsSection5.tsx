type Props = {
  companyName: string;
  companyEmail: string;
  privacyLink: string;
  updatedAt: string;
};

export default function TermsSection5({
  companyName,
  companyEmail,
  privacyLink,
  updatedAt,
}: Props) {
  return (
    <>
<h4>Termination; Cancellation</h4>
      <p>
        This Agreement shall continue in full force until terminated or canceled
        pursuant to this Agreement.
      </p>
      <p>
        {companyName} shall have the right to terminate this Agreement (i) for
        any reason whatsoever by providing thirty (30) days’ notice to you; (ii)
        immediately for your material breach of this Agreement, other than
        non-payment of Fees; or (iii) for non-payment of Fees. Notwithstanding
        the foregoing, {companyName} reserves the right, in its sole discretion
        and without notice, at any time and for any reason, to remove, modify,
        suspend, or disable access to all or any portion of the Services.
      </p>
      <p>
        You may terminate the Agreement for any reason whatsoever by providing
        thirty (30) days’ notice to {companyName} by email at {companyEmail}.
        You shall be responsible for all Fees incurred prior to and during the
        notice period.
      </p>
      <p>
        Sections titled Precautions, Intellectual Property Rights, Data and
        Communications, Indemnification, Warranty Disclaimer, Limitation of
        Liability, Governing Law, Forum; Mandatory Binding Arbitration; Class
        Action Waiver, and payment obligations for Fees incurred prior to and
        during any notice period shall survive termination of this Agreement for
        any reason whatsoever.
      </p>
      <h4>Federal Government End Use Restrictions</h4>
      <p>
        If you are a U.S. federal government department or agency or are
        contracting on behalf of such a department or agency, Services are
        “Commercial Items” as that term is defined at 48 C.F.R. §2.101,
        consisting of “Commercial Computer Software” and “Commercial Computer
        Software Documentation,” as those terms are used in 48 C.F.R. §12.212 or
        48 C.F.R. §227.7202. Consistent with 48 C.F.R. §12.212 or 48 C.F.R.
        §227.7202-1 through 227.7202-4, as applicable, the Service is licensed
        to you with only those rights as provided under the terms and conditions
        of this Agreement.
      </p>
      <h4>Export Compliance and Use Restrictions</h4>
      <p>
        You will not directly or indirectly export or re-export the Services, or
        any technical information related thereto, to any destination or person
        prohibited or restricted by applicable law, including, without
        limitation, all applicable U.S. export control laws and regulations.
      </p>
      <h4>
        Governing Law; Forum; Mandatory Binding Arbitration, Class Action Waiver
      </h4>
      <p>
        Any action related to this Agreement, the Services, and your
        relationship with {companyName} shall be governed by, construed, and
        interpreted in accordance with the laws of the State of California
        without regard to its conflict of laws principles AND WILL SPECIFICALLY
        NOT BE GOVERNED BY THE UNITED NATIONS CONVENTIONS ON CONTRACTS FOR THE
        INTERNATIONAL SALE OF GOODS, IF OTHERWISE APPLICABLE. You agree to
        resolve any disputes or claims arising out of or related to this
        Agreement or the Services through final and binding arbitration by a
        single arbitrator. This includes disputes arising out of or relating to
        interpretation or application of this “Mandatory Arbitration Provision”
        section, including its enforceability, revocability, or validity.
        Notwithstanding the foregoing, either party may bring a lawsuit solely
        for injunctive relief to stop unauthorized use or abuse of the Services,
        or violation of any intellectual property. Subject to the Mandatory
        Arbitration Provision, the parties irrevocably consent to bring any
        action to resolve or enforce claims arising under or relating to this
        Agreement in the federal or state courts in San Francisco, California,
        and each party irrevocably submits to the exclusive jurisdiction of such
        courts in any such suit, action, or proceeding. Except to the extent
        prohibited by applicable law, the parties agree that any claim or cause
        of action arising out of or related to use of the Services or this
        Agreement must be filed within one (1) year after such claim or cause of
        action arose or be forever barred. This paragraph does not apply to
        users who reside in the European Union. If you are a user based in the
        European Union, then Finnish law shall apply to this Agreement and the
        Finnish courts shall have exclusive jurisdiction to hear disputes
        arising in relation to this Agreement. This provision shall not apply to
        consumers in countries that require agreements to be governed by the
        local laws of the consumer&apos;s country. The English language shall
        govern all documents, notices, and interpretations of these Agreement.
        You also agree to waive any right to assert any claims against
        {companyName} as a representative or member in any class or
        representative action, except where such waiver is prohibited by law or
        deemed by a court of law to be against public policy.
      </p>
      <h4>Miscellaneous</h4>
      <p>
        You acknowledge that {companyName} has the right to monitor use of the
        Services to ensure compliance with the Agreement.
      </p>
      <p>
        No waiver of any term, provision, or condition of this Agreement,
        whether by conduct or otherwise, in any one or more instances, shall be
        deemed to be, or shall constitute, a waiver of any other term,
        provision, or condition hereof, whether or not similar, nor shall such
        waiver constitute a continuing waiver of any such term, provision, or
        condition hereof. No waiver shall be binding unless executed in writing
        by the party making the waiver.
      </p>
      <p>
        You may not assign this Agreement to any other party and any attempt to
        do so is void.
      </p>
      <p>
        If any provision of this Agreement is determined to be illegal or
        unenforceable, then such provision will be enforced to the maximum
        extent possible, and the other provisions will remain fully effective
        and enforceable.
      </p>
      <p>
        This Agreement and the Privacy Policy constitute the complete and
        exclusive statement of the agreement between you and {companyName}
        regarding the Services, and supersedes any and all prior or
        contemporaneous communications, representations, statements, and
        understandings, whether oral or written, between the parties.
      </p>
      <p>
        In case of any conflict between the terms of this Agreement and the
        terms of the Privacy Policy, the terms of this Agreement shall prevail.
      </p>
      
    </>
  );
}
