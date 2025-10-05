// app/api/offers/route.ts
import { getOfferByTitle } from "@/app/services/offerService";
import { prisma } from "@/lib/prisma"; // Adjust path based on your setup
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      type, // 'PERCENTAGE' | 'FLAT'
      discountValue,
      maxDiscount,
      minOrderValue,
      couponCode,
      usageLimit,
      usagePerUser,
      startDate,
      endDate,
      isActive,
      scope,
      brandId,
      categoryId,
      subCategoryId,
      productId,
      productVariantId,
    } = body;

    // Basic validation
    if (!title || !type || !discountValue || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const existingOffer = await getOfferByTitle(title);

    if (existingOffer) {
      return NextResponse.json(
        { error: `offer already exists with this name: ${title}` },
        { status: 409 }
      );
    }

    // Create the offer
    const newOffer = await prisma.offers.create({
      data: {
        scope: scope,
        title,
        description,
        type,
        discountValue,
        maxDiscount,
        minOrderValue,
        couponCode,
        usageLimit,
        usagePerUser,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive,
        brandId,
        categoryId,
        subCategoryId,
        productId,
        productVariantId,
      },
    });

    return NextResponse.json(
      { success: true, offer: newOffer },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}