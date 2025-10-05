import { Prisma } from "@prisma/client";

export const createOrderItemsRecord = async (
  tx: Prisma.TransactionClient,
  orderItemObj: Prisma.OrderItemUncheckedCreateInput
) => {
  try {
    const orderItem = await tx.orderItem.create({ data: orderItemObj });
    return orderItem;
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};
