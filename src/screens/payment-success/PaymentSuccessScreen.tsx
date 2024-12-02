import { Suspense } from "react";
import PaymentSuccess from "./PaymentSuccess";
import Spinner from "@/components/Spinner";

type PaymentSuccessScreenProps = {
  userId: string;
};

const PaymentSuccessScreen = ({ userId }: PaymentSuccessScreenProps) => {
  return (
    <Suspense fallback={<Spinner />}>
      <PaymentSuccess userId={userId} />
    </Suspense>
  );
};

export default PaymentSuccessScreen;
