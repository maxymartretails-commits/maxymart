import { prisma } from "@/lib/prisma"; // adjust the path if needed

export async function GET() {
  try {
    // Step 1: Fetch all categories with their products and variants
    const categories = await prisma.category.findMany({
      where: { deleted: false },
      include: {
        products: {
          where: {
            deleted: false,
            variants: {
              some: { deleted: false, stock: { gt: 0 } },
            },
          },
          include: {
            variants: {
              where: { deleted: false },
            },
            brand: true,
            category: true,
          },
        },
      },
    });

    const featuredProducts = categories
      .map((category) => {
        const productsWithStock = category.products.map((product) => {
          const highestStockVariant = product.variants.reduce((prev, curr) =>
            curr.stock > prev.stock ? curr : prev
          );
          return {
            ...product,
            topVariant: highestStockVariant,
          };
        });

        if (productsWithStock.length === 0) return null;

        // Get the product with the highest stock variant in this category
        const topProduct = productsWithStock.reduce((prev, curr) =>
          curr.topVariant.stock > prev.topVariant.stock ? curr : prev
        );

        return {
          id: topProduct.id,
          name: topProduct.name,
          description: topProduct.description,
          categoryId: topProduct.categoryId,
          images: topProduct.images,
          subCategoryId: topProduct.subCategoryId,
          brandId: topProduct.brandId,
          price: topProduct.topVariant.price,
          variantId: topProduct.topVariant.id,
          unit: topProduct.topVariant.unit,
          unitSize: topProduct.topVariant.unitSize,
          stock: topProduct.topVariant.stock,
          category: {
            id: topProduct.category.id,
            name: topProduct.category.name,
            image: topProduct.category.image,
          },
        };
      })
      .filter(Boolean); // remove nulls for categories without valid products

    return Response.json({ featuredProducts });
  } catch (error) {
    console.error("Error fetching top stock products per category:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
