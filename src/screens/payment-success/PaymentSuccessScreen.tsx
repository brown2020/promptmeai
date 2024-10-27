import { Suspense } from "react";
import PaymentSuccess from "./PaymentSuccess";
import Spinner from "@/components/Spinner";

const PaymentSuccessScreen = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <PaymentSuccess />
    </Suspense>
  );
};

export default PaymentSuccessScreen;
