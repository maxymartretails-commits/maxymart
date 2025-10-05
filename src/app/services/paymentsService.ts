import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type CreatePaymentInput = Omit<
  Payment,
  "id" | "captured" | "createdAt" | "updatedAt" | "order"
>;

export interface Payment {
  id: string;
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  signature?: string;
  amount: number; // in rupees
  currency: string; // default: "INR"
  status: string; // e.g., "created", "paid", "failed"
  captured: boolean;
  email?: string;
  contact?: string;
}

export const createPaymentsRecord = async (
  paymentsObj: any,
  tx: Prisma.TransactionClient = prisma
) => {
  try {
    const newPayementRecord = await tx.payments.create({ data: paymentsObj });
    return newPayementRecord;
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};
export const updatePaymentsRecord = async (
  razorpayOrderId: string,
  paymentsObj: CreatePaymentInput,
  tx: Prisma.TransactionClient = prisma
) => {
  try {
    const updatePayementData = await tx.payments.updateMany({
      where: { razorpayOrderId: razorpayOrderId },
      data: paymentsObj,
    });

    return updatePayementData;
  } catch (error: any) {
    console.error("Error in updatePaymentsRecord", error);
    throw error;
  }
};
