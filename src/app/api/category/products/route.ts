import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") as string;
    const subCategoryId = searchParams.get("subCategoryId");
    const brandId = searchParams.get("brandId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);

    if (!categoryId) {
      return NextResponse.json(
        { message: "categoryId is required" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const [subCategories, productBrands] = await Promise.all([
      prisma.subCategory.findMany({
        where: { categoryId },
        select: { id: true },
      }),
      prisma.product.findMany({
        where: { categoryId },
        select: { brandId: true },
        distinct: ["brandId"],
      }),
    ]);

    const allSubCategoryIds = subCategories.map((s) => s.id);
    const brandIds = productBrands.map((p) => p.brandId);

    const productWhere: any = {
      categoryId,
      subCategoryId: subCategoryId ? subCategoryId : { in: allSubCategoryIds },
      brandId: brandId ? brandId : { in: brandIds },
    };


    const products = await prisma.product.findMany({
      where: productWhere,
      skip,
      take: limit,
      include: {
        variants: true,
      },
    });

    const total = await prisma.product.count({ where: productWhere });

    return NextResponse.json({
      products,
      page,
      total,
      hasMore: skip + limit < total,
    });
  } catch (error: any) {
    console.error("Catalog API error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
