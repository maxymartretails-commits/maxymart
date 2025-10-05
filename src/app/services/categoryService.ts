import { prisma } from "@/lib/prisma";

export async function getAllCategory() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      //   take: limit,
      //   skip: offset,
      include: {
        products: { include: { variants: true } },
        subCategory: {
          include: { products: { include: { brand: true, variants: true } } },
        },
      },
    });
    return categories;
  } catch (error) {
    console.log("Error in getAllCategory", error);
    throw error;
  }
}
