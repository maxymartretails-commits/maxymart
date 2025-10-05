// app/api/offers/route.ts
import { lockRowForUpdate } from "@/app/lib/lockRow";
import { getOfferById, updateOfferById } from "@/app/services/offerService";
import {
  applayDiscountedPriceByScope,
  removeDiscountedPriceByScope,
} from "@/app/services/ProductsService";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const id = searchParams.get("id") as string;

    const body = await request.json();
    const { isActive } = body;

    await lockRowForUpdate(id, "Offers");
    const existingOffer = await getOfferById(id);

    if (!existingOffer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    const updatedOffer = await updateOfferById(id, { isActive: isActive });
    console.log(
      "updatedOffer.isActive",
      updatedOffer.isActive &&
      (updatedOffer.brandId ||
        updatedOffer.categoryId ||
        updatedOffer.subCategoryId ||
        updatedOffer.productId ||
        updatedOffer.productVariantId)
    );

    if (
      updatedOffer.isActive &&
      (updatedOffer.brandId ||
        updatedOffer.categoryId ||
        updatedOffer.subCategoryId ||
        updatedOffer.productId ||
        updatedOffer.productVariantId)
    ) {
      const updateProductVarient = await applayDiscountedPriceByScope(
        existingOffer,
        {
          brandId: existingOffer?.brandId ?? undefined,
          categoryId: existingOffer.categoryId ?? undefined,
          productId: existingOffer.productId ?? undefined,
          productVariantId: existingOffer.productVariantId ?? undefined,
          subCategoryId: existingOffer.subCategoryId ?? undefined,
        }
      );
    } else if (!updatedOffer.isActive) {
      const updateProductVarient = await removeDiscountedPriceByScope(
        existingOffer,
        {
          brandId: existingOffer?.brandId ?? undefined,
          categoryId: existingOffer.categoryId ?? undefined,
          productId: existingOffer.productId ?? undefined,
          productVariantId: existingOffer.productVariantId ?? undefined,
          subCategoryId: existingOffer.subCategoryId ?? undefined,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        existingOffer,
        offer: updatedOffer,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
