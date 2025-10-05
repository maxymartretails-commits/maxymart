import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAllCartItemsByUserId } from "@/app/services/cartItemsService";
import {
  applyOffer,
  calculateGSTBreakup,
  ProductWithTaxRates,
} from "@/app/services/OrdersService";
import { getOfferByCouponCode } from "@/app/services/offerService";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id as string;
    const { searchParams } = new URL(request.url);
    const offerId = searchParams.get("id");
    const couponCode = searchParams.get("couponCode");

    if (!userId) {
      return NextResponse.json(
        { message: "userId is missing" },
        { status: 400 }
      );
    }
    const cartData = await getAllCartItemsByUserId(userId);
    let cartWithGSTbreakup = [];

    let finalAmount = 0;
    let deliveryFee = 50;
    let amount = 0;
    for await (const cart of cartData) {
      const productWithTaxRates: ProductWithTaxRates = {
        basePrice: cart.productVariant?.discountedPrice as number,
        quantity: cart.quantity,
        cgstRate: cart.product.cgst,
        igstRate: cart.product.igst,
        sgstRate: cart.product.sgst,
      };

      const gstBreakup = await calculateGSTBreakup({
        productWithTaxRates: productWithTaxRates,
        buyerState: cart?.user?.Address[0]?.state,
        deliveryFee:50
      });

      console.log(gstBreakup,"gst")
      finalAmount += gstBreakup.totalPrice;
      amount += gstBreakup.totalPrice;
      cartWithGSTbreakup.push({
        basePrice: cart.productVariant?.price,
        deliveryFee: deliveryFee,
        discountedPrice: Number(cart?.productVariant?.discountedPrice) * cart.quantity,
        cgstRate: gstBreakup.cgst,
        igstRate: gstBreakup.igst,
        sgstRate: gstBreakup.sgst,
        totalPrice: gstBreakup.totalPrice,
      });
    }

    finalAmount = amount + 50; //50 is deliveryFee

    if (couponCode) {
      const offerData = await getOfferByCouponCode(couponCode);

      const offer = await applyOffer({
        userId: userId,
        totalOrderAmount: finalAmount,
        offerId: offerData.id,
      });

      finalAmount -= offer?.discountAmount;
    }

    if (offerId) {
      const offer = await applyOffer({
        userId: userId,
        totalOrderAmount: finalAmount,
        offerId,
      });

      finalAmount -= offer?.discountAmount;
    }

    return NextResponse.json({ cartWithGSTbreakup, finalAmount });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
