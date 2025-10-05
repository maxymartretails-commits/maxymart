import Razorpay from "razorpay";

import { validateEnvVars } from "../utils/validateEnv";
import { Prisma } from "@prisma/client";

validateEnvVars(["NEXT_PUBLIC_RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"]);

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createOrderInvoice = async (
  invoiceObj: any,
  tx: Prisma.TransactionClient = prisma
) => {
  try {
    console.log("invoiceObj", invoiceObj);
    const invoice = await razorpay.invoices.create(invoiceObj);

    return invoice;
  } catch (error) {
    console.log("Error in placeOrderController", error);
    throw error;
  }
};
