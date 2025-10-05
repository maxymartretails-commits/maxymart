import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getRoleByName } from "./userService";
import { getAddressByUserId } from "./addressService";

export type UpdateOrderInput = Partial<
  Omit<Order, "id" | "createdAt" | "updatedAt" | "deleted">
>;

export type CreateOrderInput = Omit<
  Order,
  "id" | "createdAt" | "updatedAt" | "deleted"
>;

type ApplyOfferInput = {
  userId: string;
  totalOrderAmount: number; // in INR
  offerId: string; // optional
};
type ApplyOfferToProductsInput = {
  totalOrderAmount: number; // in INR
  offer: any;
};

export type ProductWithTaxRates = {
  basePrice: number; // base price per unit
  deliveryFee?: number;
  quantity: number;
  cgstRate?: number; // per product
  sgstRate?: number;
  igstRate?: number;
};
export interface GSTBreakup {
  subTotal: number;
  gstAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalPrice: number;
  isIGST: boolean;
}

export interface Order {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  total: number;
  paymentStatus: string; // "pending", "success", "failed"
  status: string;
  addressId: string;
  invoice?: string;
}

export const createOrderRecord = async (
  tx: Prisma.TransactionClient,
  orderObj: Prisma.OrderUncheckedCreateInput
) => {
  try {
    const order = await tx.order.create({
      data: orderObj,
      include: { address: true },
    });
    return order;
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};

export const updateOrder = async (
  orderObj: CreateOrderInput,
  orderId: string,
  tx: Prisma.TransactionClient = prisma
) => {
  try {
    const updatePayementData = await tx.order.updateMany({
      where: { id: orderId },
      data: orderObj,
    });
    return updatePayementData;
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};
export const getOrderById = async (
  orderId: string,
  tx: Prisma.TransactionClient = prisma
) => {
  try {
    const orderData = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        user: { include: { Address: true } },
      },
    });

    return orderData;
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};

export const getOrderByOrderId = async (
  orderId: string,
  tx: Prisma.TransactionClient = prisma
) => {
  try {
    const orderData = await tx.order.findUnique({
      where: { id: orderId },
    });

    return orderData;
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};
export const applyOfferToProducts = async ({
  totalOrderAmount,
  offer,
}: ApplyOfferToProductsInput) => {
  try {
    const now = new Date();

    if (totalOrderAmount <= 0) {
      throw new Error(`Minimum order value must be ₹ 0`);
    }

    // 💰 Calculate discount
    let discount = 0;
    if (offer) {
      if (offer.type === "PERCENTAGE") {
        discount = (offer.discountValue / 100) * totalOrderAmount; //32.05
        if (discount > (offer.maxDiscount / 100) * totalOrderAmount) {
          discount = (offer.maxDiscount / 100) * totalOrderAmount;
        }
        console.log("percentage",discount);
      } else if (offer.type === "FLAT") {
        discount = offer.discountValue;
        console.log("flat")
      }
    }
    const finalAmount = Math.max(totalOrderAmount - discount, 0);
    // console.log("discoutn------", discount);
    // console.log("finalAmount------", finalAmount);

    return {
      discountAmount: discount,
      finalAmount,
      discountValue: offer?.discountValue,
      title: offer?.title,
      type: offer?.type,
    };
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};

export const applyOffer = async ({
  userId,
  totalOrderAmount,
  offerId,
}: ApplyOfferInput) => {
  try {
    const now = new Date();
    let offer = null;
    if (offerId) {
      offer = await prisma.offers.findFirst({
        where: {
          id: offerId,
          isActive: true,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      });

      if (!offer) {
        throw new Error("expired coupon");
      }

      if (offer.minOrderValue && totalOrderAmount < offer.minOrderValue) {
        throw new Error(`Minimum order value must be ₹${offer.minOrderValue}`);
      }

      if (offer.usageLimit) {
        const totalUsed = await prisma.redemption.count({
          where: { offerId: offer.id },
        });
        if (totalUsed >= offer.usageLimit) {
          throw new Error("This offer has reached its usage limit");
        }
      }
      if (offer.usagePerUser) {
        const userUsed = await prisma.redemption.count({
          where: { offerId: offer.id, userId },
        });
        if (userUsed >= offer.usagePerUser) {
          throw new Error("You have already used this offer");
        }
      }
    }

    let discount = 0;
   if (offer) {
  if (offer.type === "PERCENTAGE") {
    discount = (offer.discountValue / 100) * totalOrderAmount;

    const maxDiscount = offer.maxDiscount ?? Infinity;
    if (discount > (maxDiscount / 100) * totalOrderAmount) {
      discount = (maxDiscount / 100) * totalOrderAmount;
    }
  } else if (offer.type === "FLAT") {
    discount = offer.discountValue;
  }
}
    const finalAmount = Math.max(totalOrderAmount - discount, 0);

    return {
      discountAmount: discount,
      finalAmount,
      discountValue: offer?.discountValue,
      type: offer?.type,
    };
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};

export const calculateGSTBreakup = async ({
  productWithTaxRates,
  buyerState,
  deliveryFee
}: {
  productWithTaxRates: ProductWithTaxRates;
  buyerState: string;
  deliveryFee?:number;
}): Promise<GSTBreakup> => {
  const admin = await getRoleByName("admin");
  const adminUserId = admin.userData?.users[0].id as string;

  const adminAddress = await getAddressByUserId(adminUserId);

  const sellerState = adminAddress.state;

  if (!admin.success) {
    throw new Error(admin.message);
  }

  console.log("buyerState", buyerState);

  const isIGST =
    buyerState.trim().toLowerCase() !== sellerState.trim().toLowerCase();
  const baseAmount =
    productWithTaxRates.basePrice * productWithTaxRates.quantity;

  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  if (isIGST) {
    igst = baseAmount * ((productWithTaxRates.igstRate ?? 0) / 100);
  } else {
    cgst = baseAmount * ((productWithTaxRates.cgstRate ?? 0) / 100);
    sgst = baseAmount * ((productWithTaxRates.sgstRate ?? 0) / 100);
  }

  const gstAmount = +(cgst + sgst + igst).toFixed(2);
  const totalPrice = +(
    baseAmount +
    gstAmount
  ).toFixed(2);

  return {
    subTotal: +baseAmount.toFixed(2),
    gstAmount,
    cgst: +cgst.toFixed(2),
    sgst: +sgst.toFixed(2),
    igst: +igst.toFixed(2),
    totalPrice:totalPrice,
    isIGST,
  };
};
