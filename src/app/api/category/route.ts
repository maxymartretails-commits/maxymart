import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const categories = await prisma.category.findMany({
      where: { deleted: false },
      include: {
        subCategory: {
          where: { deleted: false },
        },
        Offers: {
          where: { deleted: false }
        },
        products: {
          where: { deleted: false },
          include: {
            brand: true,
            subCategory: true,
            variants: {
              where: { deleted: false },
            },
          },
        },
      },
    });

    // console.log(categories, "categories")

    const formatted = categories.map((category) => {
      // Group products by subcategory
      const subCategoryMap: Record<
        string,
        {
          id: string;
          name: string;
          image: string;
          subCategoryProductStock: number;
          brands: {
            id: string;
            name: string;
            individualBrandStock: number;
          }[];
        }
      > = {};

      for (const product of category.products) {
        const subCat = product.subCategory;
        if (!subCat) continue;

        const subCatId = subCat.id;
        const brandId = product.brand?.id || "unknown";
        const brandName = product.brand?.name || "Unknown Brand";

        // Initialize subcategory if not already
        if (!subCategoryMap[subCatId]) {
          subCategoryMap[subCatId] = {
            id: subCatId,
            name: subCat.name,
            image: subCat.image || "",
            subCategoryProductStock: 0,
            brands: [],
          };
        }

        let productTotalStock = 0;
        for (const variant of product.variants) {
          productTotalStock += variant.stock;
          subCategoryMap[subCatId].subCategoryProductStock += variant.stock;
        }

        // Update indivdualProductStock per brand
        const brandEntry = subCategoryMap[subCatId].brands.find(
          (b) => b.id === brandId
        );
        if (brandEntry) {
          brandEntry.individualBrandStock += productTotalStock;
        } else {
          subCategoryMap[subCatId].brands.push({
            id: brandId,
            name: brandName,
            individualBrandStock: productTotalStock,
          });
        }
      }

      const formattedOffers = category.Offers?.map((offer) => ({
        id: offer.id,
        discountedValue: offer.discountValue,
        type:offer.type
      })) || [];

      return {
        id: category.id,
        name: category.name,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        image: category.image,
        description: category.description,
        offers: formattedOffers,
        subCategories: Object.values(subCategoryMap),
      };
    });

    return NextResponse.json({ categories: formatted });
  } catch (error: any) {
    console.error("Catalog API error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id as string;

    if (!userId) {
      return NextResponse.json(
        { message: "user id missing" },
        { status: 404 }
      );

    }

    const body = await request.json();
    const { name, description, image } = body;

    await prisma.category.create({
      data: {
        name,
        description,
        image
      }
    })

    return NextResponse.json({
      message: "Category added successfully",
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id as string;

    if (!userId) {
      return NextResponse.json(
        { message: "user id missing" },
        { status: 404 }
      );

    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');
    const body = await request.json();

    await prisma.category.update({
      where: {
        id: String(categoryId)
      },
      data: {
        ...body
      }
    })

    return NextResponse.json(
      { message: "Category updated successfully" },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}


export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") as string;

    await prisma.category.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json({
      message: "Category deleted successfully"
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
