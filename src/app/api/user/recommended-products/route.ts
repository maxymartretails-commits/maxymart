// app/api/user/personalized-products/route.ts
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id as string;

  try {
    const order = await prisma.order.findMany({
      where: { userId: userId },
      include: {
        address: true,
        items: { include: { product: true, ProductVariant: true } },
      },
    });
    // Step 1: Get user's 5 most recent orders
    const recentOrders = await prisma.order.findMany({
      where: {
        userId,
        deleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        items: {
          include: {
            product: {
              select: {
                categoryId: true,
                brandId: true,
              },
            },
          },
        },
      },
    });

    // Step 2: Collect category and brand IDs from those orders
    const categoryIds = new Set<string>();
    const brandIds = new Set<string>();

    recentOrders.forEach((order) => {
      order.items.forEach((item) => {
        categoryIds.add(item.product.categoryId);
        brandIds.add(item.product.brandId);
      });
    });

    // Step 3: Fetch recommended products based on those categories or brands
    const recommendedProducts = await prisma.product.findMany({
      where: {
        deleted: false,
        OR: [
          { categoryId: { in: [...categoryIds] } },
          { brandId: { in: [...brandIds] } },
        ],
      },
      take: 10,
      include: {
        variants: true,
        brand: true,
        category: true,
      },
    });
    let formattedRes = recommendedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      images: product.images,
      subCategoryId: product.subCategoryId,
      brandId: product.brandId,
      price: product.variants[0].price,
      variantId: product.variants[0].id,
      unit: product.variants[0].unit,
      unitSize: product.variants[0].unitSize,
      stock: product.variants[0].stock,
      category: {
        id: product.category.id,
        name: product.category.name,
        image: product.category.image,
      },
    }));

    return NextResponse.json({
      formattedRes,
      success: true,
      recommendedProducts,
    });
  } catch (error) {
    console.error("Personalized API error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
