import CardContent from "@/components/v2/CardContent";
import Table from "@/components/v2/Table";

const PaymentHistory = () => {
  return (
    <CardContent
      title="Payment History"
      overrideStyles="col-span-1 lg:col-span-2 xl:col-span-3"
    >
      <Table />
    </CardContent>
  );
};

export default PaymentHistory;
