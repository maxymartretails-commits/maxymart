import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type ApplyOfferInput = {
  userId: string;
  orderAmount: number; // in INR
  couponCode?: string; // optional
};
type UpdateOfferInput = Partial<{
  title: string;
  description: string;
  type: "PERCENTAGE" | "FLAT";
  discountValue: number;
  maxDiscount: number;
  minOrderValue: number;
  couponCode: string | null;
  usageLimit: number;
  usagePerUser: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}>;

export const getOfferById = async (
  id: string,
  tx: Prisma.TransactionClient = prisma
) => {
  try {
    const offer = await tx.offers.findFirst({
      where: { id: id, deleted: false },
    });

    return offer;
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};

export const getOfferByCouponCode = async (
  couponCode: string,
  tx: Prisma.TransactionClient = prisma
) => {
  try {
    const offer = await tx.offers.findUnique({
      where: { couponCode: couponCode, deleted: false },
    });

    if (!offer) {
      throw new Error("offer not found for this coupon code");
    }

    return offer;
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};

export const getOfferByTitle = async (
  title: string,
  tx: Prisma.TransactionClient = prisma
) => {
  try {
    const offer = await tx.offers.findFirst({
      where: { title: title, deleted: false },
    });

    return offer;
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};

export const getAllOffer = async (tx: Prisma.TransactionClient = prisma) => {
  try {
    const offer = await tx.offers.findMany({
      where: { deleted: false },
    });

    return offer;
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};

export async function updateOfferById(id: string, data: UpdateOfferInput) {
  try {
    const updatedOffer = await prisma.offers.update({
      where: { id },
      data,
    });

    return updatedOffer;
  } catch (error) {
    console.error("Failed to update offer:", error);
    throw new Error("Offer update failed");
  }
}
