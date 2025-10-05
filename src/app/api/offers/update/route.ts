// app/api/offers/route.ts
import { lockRowForUpdate } from "@/app/lib/lockRow";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const id = searchParams.get("id") as string;

    const body = await request.json();
    const {
      title,
      description,
      type,
      discountValue,
      maxDiscount,
      minOrderValue,
      couponCode,
      usageLimit,
      usagePerUser,
      startDate,
      endDate,
    } = body;

    await lockRowForUpdate(id, "offers");

    const existingOffer = await prisma.offers.findUnique({
      where: { id: id },
    });

    if (!existingOffer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    const updatedOffer = await prisma.offers.update({
      where: { id: existingOffer.id },
      data: {
        title,
        description,
        type,
        discountValue,
        maxDiscount,
        minOrderValue,
        couponCode,
        usageLimit,
        usagePerUser,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    return NextResponse.json(
      { success: true, offer: updatedOffer },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
