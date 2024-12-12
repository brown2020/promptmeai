import { auth } from "@/auth";
import PaymentSuccessScreen from "@/screens/payment-success";

const PaymentSuccessPage = async () => {
  const session = await auth();

  return <PaymentSuccessScreen userId={session?.user?.id || ""} />;
};

export default PaymentSuccessPage;
