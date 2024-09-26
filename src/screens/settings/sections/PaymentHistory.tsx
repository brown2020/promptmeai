"use client";

import CardContent from "@/components/v2/CardContent";
import Spinner from "@/components/v2/Spinner";
import Table from "@/components/v2/Table";
import { formatNumber, subcurrencyToNumber } from "@/utils/number";
import { capitalize } from "@/utils/text";
import { useAuthStore } from "@/zustand/useAuthStore";
import { PaymentType, usePaymentsStore } from "@/zustand/usePaymentsStore";
import { Timestamp } from "firebase/firestore";
import { useEffect } from "react";

type TableData = {
  no: number;
  product: string;
} & PaymentType;

const PaymentHistory = () => {
  const uid = useAuthStore((state) => state.uid);
  const { payments, paymentsLoading, fetchPayments } = usePaymentsStore();

  useEffect(() => {
    if (uid) {
      fetchPayments();
    }
  }, [uid, fetchPayments]);

  const tableData: TableData[] = payments.map((payment, i) => ({
    ...payment,
    no: i + 1,
    product: "10,000 Credits",
  }));

  return (
    <CardContent
      title="Payment History"
      overrideStyles="col-span-1 lg:col-span-2 xl:col-span-3"
    >
      {paymentsLoading || !uid ? (
        <Spinner />
      ) : (
        <Table
          data={tableData}
          headers={[
            { key: "no", label: "No" },
            { key: "product", label: "Product" },
            {
              key: "amount",
              label: "Amount",
              render: (amount) =>
                formatNumber(subcurrencyToNumber(Number(amount)), 2, "$"),
            },
            {
              key: "createdAt",
              label: "Transaction Date",
              render: (createdAt) =>
                createdAt
                  ? (createdAt as Timestamp).toDate().toLocaleString()
                  : "N/A",
            },
            {
              key: "status",
              label: "Status",
              render: (status) => capitalize(String(status)),
            },
          ]}
        />
      )}
    </CardContent>
  );
};

export default PaymentHistory;
