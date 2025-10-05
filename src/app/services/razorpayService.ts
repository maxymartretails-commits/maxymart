import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getOrderByOrderId, updateOrder } from "../services/OrdersService";
import {
  CreatePaymentInput,
  updatePaymentsRecord,
} from "../services/paymentsService";
import { getRazorpayOrder } from "../lib/createRazorpayOrder";

export const paymentWebHookController = async (data: any) => {
  try {
    return await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const paymentsObj: CreatePaymentInput = {
          orderId: data.orderId,
          razorpayOrderId: data.razorpayOrderId,
          razorpayPaymentId: data.paymentId,
          amount: data.amount,
          currency: data.currency,
          signature: data.razorpaySignature,
          status: data.status,
        };

        const updatedPayement = await updatePaymentsRecord(
          data.razorpayOrderId,
          paymentsObj,
          tx
        );

        const razorpayOrder = await getRazorpayOrder(data.razorpayOrderId);
        let updatedOrder = null;
        if (
          razorpayOrder.order.items[0].status === "captured" &&
          razorpayOrder.order.items[0].id === data.paymentId
        ) {
          const order = await getOrderByOrderId(data.orderId);

          const orderObj: any = {
            ...order,
            paymentStatus: "paid",
            status: "confirmed",
          };

          updatedOrder = await updateOrder(orderObj, data.orderId, tx);
        } else {
          throw new Error(
            "unable to update order details due invalid paymentId (Razorpay) or payment not received"
          );
        }

        return { razorpayOrder, updatedOrder };
      }
      // { timeout: 200000 }
    );
  } catch (error) {
    console.log("Error in placeOrderController", error);
    throw error;
  }
};
