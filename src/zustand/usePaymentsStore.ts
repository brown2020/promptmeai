import { create } from "zustand";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { useAuthStore } from "./useAuthStore";
import { db } from "@/firebase/firebaseClient";
import { paths, collections } from "@/firebase/paths";
import { logger } from "@/utils/logger";
import toast from "react-hot-toast";

export type PaymentType = {
  id: string;
  amount: number;
  createdAt: Timestamp | null;
  status: string;
  mode: string;
  platform: string;
  productId: string;
  currency: string;
};

interface PaymentsStoreState {
  payments: PaymentType[];
  paymentsLoading: boolean;
  paymentsError: string | null;
  fetchPayments: () => Promise<void>;
  addPayment: (payment: Omit<PaymentType, "createdAt">) => Promise<void>;
  checkIfPaymentProcessed: (paymentId: string) => Promise<PaymentType | null>;
}

export const usePaymentsStore = create<PaymentsStoreState>((set) => ({
  payments: [],
  paymentsLoading: false,
  paymentsError: null,

  fetchPayments: async () => {
    const uid = useAuthStore.getState().uid;
    if (!uid) {
      logger.warn("Invalid UID for fetchPayments");
      return;
    }

    set({ paymentsLoading: true });

    try {
      const paymentsPath = paths.userPayments(uid);
      const q = query(
        collection(db, collections.USERS, uid, collections.PAYMENTS)
      );
      const querySnapshot = await getDocs(q);
      const payments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        amount: doc.data().amount,
        createdAt: doc.data().createdAt,
        status: doc.data().status,
        mode: doc.data().mode,
        platform: doc.data().platform,
        productId: doc.data().productId,
        currency: doc.data().currency,
      }));

      // Sort payments by createdAt with newest at the top (handle null safely)
      payments.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() ?? 0;
        const timeB = b.createdAt?.toMillis() ?? 0;
        return timeB - timeA;
      });

      set({ payments, paymentsLoading: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      logger.error("Error fetching payments:", errorMessage);
      set({ paymentsError: errorMessage, paymentsLoading: false });
    }
  },

  addPayment: async (payment) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) {
      logger.warn("Invalid UID for addPayment");
      return;
    }

    set({ paymentsLoading: true });

    try {
      // Query to check if the payment with the same id already exists
      const q = query(
        collection(db, collections.USERS, uid, collections.PAYMENTS),
        where("id", "==", payment.id)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error("Payment with this ID already exists.");
        set({ paymentsLoading: false });
        return;
      }

      const newPaymentDoc = await addDoc(
        collection(db, collections.USERS, uid, collections.PAYMENTS),
        {
          id: payment.id,
          amount: payment.amount,
          createdAt: Timestamp.now(),
          status: payment.status,
          mode: payment.mode,
          platform: payment.platform,
          productId: payment.productId,
          currency: payment.currency,
        }
      );

      const newPayment = {
        id: newPaymentDoc.id,
        amount: payment.amount,
        createdAt: Timestamp.now(),
        status: payment.status,
        mode: payment.mode,
        platform: payment.platform,
        productId: payment.productId,
        currency: payment.currency,
      };

      set((state) => {
        const updatedPayments = [...state.payments, newPayment];

        // Sort payments by createdAt with newest at the top (handle null safely)
        updatedPayments.sort((a, b) => {
          const timeA = a.createdAt?.toMillis() ?? 0;
          const timeB = b.createdAt?.toMillis() ?? 0;
          return timeB - timeA;
        });

        return { payments: updatedPayments, paymentsLoading: false };
      });

      toast.success("Payment added successfully.");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      logger.error("Error adding payment:", errorMessage);
      set({ paymentsError: errorMessage, paymentsLoading: false });
    }
  },

  checkIfPaymentProcessed: async (paymentId) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return null;

    const q = query(
      collection(db, collections.USERS, uid, collections.PAYMENTS),
      where("id", "==", paymentId),
      where("status", "==", "succeeded")
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as PaymentType;
    }

    return null;
  },
}));
