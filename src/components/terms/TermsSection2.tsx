type Props = {
  companyName: string;
  companyEmail: string;
  privacyLink: string;
  updatedAt: string;
};

export default function TermsSection2({
  companyName,
  companyEmail,
  privacyLink,
  updatedAt,
}: Props) {
  return (
    <>
<h4>Payment and Fees</h4>
      <p>
        Paid Services include the Services, which may be one-time purchases or
        automatically renewing subscription services (“Paid Services”),
        including our Sites and Mobile Apps (“Subscriptions”). We may make
        changes to, suspend, or discontinue Paid Services at any time for any
        reason, and {companyName} reserves the sole discretion to determine
        which Services or portions thereof require payment.
      </p>
      <p>
        Paid Services may include pre-ordered products that will be produced for
        you in the future (“Pre-Order”). You will be charged a Pre-Order fee
        when placing your Pre-Order. The actual date for shipping any accepted
        Pre-Order will depend on a variety of factors, including but not limited
        to, the date of payment of your Pre-Order fee and {companyName}’s
        production schedule. There is no shipping date guarantee for Pre-Orders.
      </p>
      <p>
        You agree to pay all applicable fees for Paid Services including,
        without exclusion, any monthly subscription fees, user fees, and
        offering fees and any other fees, charges, or costs that you agree to
        purchase as part of the Paid Services during the checkout process
        (“Fees”). You agree to pay all Fees and all applicable taxes incurred
        prior to termination or cancellation of the Agreement.
      </p>
      <p>
        You authorize {companyName} to charge your designated payment method for
        Paid Services. By providing an acceptable payment method, you represent
        and warrant that you are authorized to use the designated payment method
        and that you authorize us or our third-party payment processor to charge
        your payment method for the total amount of your purchase, including any
        applicable taxes and other charges. If the payment method cannot be
        verified, is invalid, or is otherwise not acceptable, your Paid Service
        may be suspended or canceled. You must resolve any problem we encounter
        in relation to the payment method you provide in order to proceed with
        your use of the Service. If you accept a promotional offer or make
        changes to your Paid Services, the Fees, taxes, and amounts billed may
        vary. Billing amounts may also vary due to changes in applicable taxes
        or currency exchange rates. You authorize us or our third-party payment
        processor to charge your payment method for the corresponding amount.
        Refunds will not be issued unless required by law. This payment
        obligation shall survive termination or cancellation of this Agreement
        for any reason whatsoever.
      </p>
      <p>
        If you choose to finance a purchase through our third-party payment
        processor and one or more items in your order has an extended ship date,
        your loan payment(s), including interest, may be due before we ship all
        of the items. Please note that you may not receive a rebate of any
        interest that may have already accrued on an amount that is later
        refunded.
      </p>
      <h4>Subscriptions</h4>
      <p>
        Certain Paid Services are subscription-based purchases, to which the
        following terms apply:
      </p>
      <p>
        Your Subscription term may vary as a continuous, monthly, or annual term
        (“Subscription Term(s)”), as described in the course of purchasing the
        Paid Services. Your Subscription will auto-renew for additional
        Subscription Terms until your Subscription is canceled by you, or
        suspended or terminated by {companyName}. Unless otherwise indicated by
        us, your designated payment method will be charged prior to, or at the
        beginning of, each Subscription Term for the Subscription fee plus any
        applicable taxes and other charges. Before charging you for a
        Subscription Term, we will notify you of the applicable fees, and the
        renewal will occur at the price then in effect for the Paid Service.
      </p>
      <p>
        You may cancel your Subscription at any time. Your cancellation will
        take effect at the end of the current Subscription Term. To cancel your
        subscription and automatic payment, click on the “View Subscription”
        button from your account screen to go to the Stripe customer portal
        where you can manage or cancel your subscription, or email us at{" "}
        {companyEmail}. Cancellation does not entitle you to the refund of any
        previously paid Fees and you will not receive a prorated refund for the
        remainder of the Subscription Term. In the event you cancel your
        Subscription, note that we may still send you promotional
        communications, unless you opt out of receiving those communications by
        following the unsubscribe instructions provided in the communications.
      </p>
      <p>
        When you cancel a Subscription, you cancel only future charges for your
        Subscription. You will not receive a refund for the current Subscription
        Term you paid for, but you will continue to have full access to that
        Subscription until the end of that current Subscription Term. At any
        time for any reason, we may provide a refund, discount, or other
        consideration (“credits”) to some or all of our users. The amount and
        form of such credits, and the decision to provide them, are at our sole
        and absolute discretion. The provision of credits in one instance does
        not entitle you to credits in the future for similar instances, nor does
        it obligate us to provide credits in the future.
      </p>
      <p>
        If you reside outside the United States and change your mind about your
        purchase, you may be entitled to receive a full refund within fourteen
        (14) days (the “Cooling-Off Period”), provided that you have not logged
        in or otherwise redeemed or started to use the Services as a subscriber
        during the Cooling-Off Period.
      </p>
      <p>
        From time to time, we may offer free trials of certain Subscriptions for
        specified periods of time without payment. Prior to starting your free
        trial we will notify you of the applicable Subscription fees that will
        be charged at the expiration of your free trial. Unless you cancel your
        Subscription prior to the end of your free trial by taking the steps
        outlined above, when your free trial ends, we or our third-party payment
        processor will bill your designated payment method on a recurring basis
        for your Subscription fee, plus any applicable taxes and other charges,
        for as long as your Subscription continues. You must cancel your
        Subscription before the end of your free trial period to avoid any
        charges. Instructions for canceling your Subscription are described
        above.
      </p>
      <p>
        Your payment information will be processed and stored through a
        third-party payment processor. All paid account holders must maintain at
        least one valid payment method for payment of Fees, which are described
        in more detail during checkout. All Fees are calculated and billed to
        you on a monthly or annual basis depending upon your choice, and are due
        immediately upon receipt and are subject to change. You acknowledge that
        Fees have a recurring payment feature and you accept responsibility for
        all recurring charges prior to cancellation. Fees shall be charged or
        debited from the saved, designated payment method you provide one day
        prior to the monthly or yearly anniversary of the initial purchase date.
      </p>
      <p>
        In the event that you have not logged in or otherwise used the Services
        for six (6) months, we reserve the right to terminate your subscription
        and cancel any pending purchase(s). You will not be entitled to a refund
        for the value of the Subscription during the free trial.
      </p>
      <p>
        {companyName} reserves the right to adjust the Fees for our Paid
        Services, or any features or parts of our Paid Services, at any time.
        You acknowledge that {companyName} may change the Fees for Paid Services
        at any time. In the event of such a change, {companyName}
        will provide notice to you via the email address associated with your
        account at least thirty (30) days in advance of the effective date of
        the change. Your continued use of the Services indicates your acceptance
        of any changes to the Fees. You are solely responsible for all
        applicable taxes, and will be charged for taxes when required by law.
      </p>
      
    </>
  );
}
