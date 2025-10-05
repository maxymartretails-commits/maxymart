import { prisma } from "@/lib/prisma"; // adjust path to your Prisma client
import { $Enums, Prisma } from "@prisma/client";
import { applyOfferToProducts } from "./OrdersService";

// Define Offer type based on typical discount/offer structure
export interface Offer {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  productId: string | null;
  description: string | null;
  categoryId: string | null;
  subCategoryId: string | null;
  brandId: string | null;
  isActive: boolean;
  title: string;
  type: $Enums.OfferType;
  discountValue: number;
  maxDiscount: number | null;
  minOrderValue: number | null;
  couponCode: string | null;
  usageLimit: number | null;
  usagePerUser: number | null;
  startDate: Date;
  endDate: Date;
  scope: string;
  productVariantId: string | null;
}

export const applayDiscountedPriceByScope = async (
  offer: Offer,
  scope: {
    categoryId?: string;
    brandId?: string;
    productId?: string;
    productVariantId?: string;
    subCategoryId?: string;
  },
  tx: Prisma.TransactionClient = prisma
) => {
  try {
    const orFilters: any[] = [];

    if (scope.categoryId) {
      orFilters.push({
        product: {
          categoryId: Array.isArray(scope.categoryId)
            ? { in: scope.categoryId }
            : scope.categoryId,
        },
      });
    }

    if (scope.subCategoryId) {
      orFilters.push({
        product: {
          subCategoryId: Array.isArray(scope.subCategoryId)
            ? { in: scope.subCategoryId }
            : scope.subCategoryId,
        },
      });
    }

    if (scope.brandId) {
      orFilters.push({
        product: {
          brandId: Array.isArray(scope.brandId)
            ? { in: scope.brandId }
            : scope.brandId,
        },
      });
    }

    if (scope.productId) {
      orFilters.push({
        product: {
          id: Array.isArray(scope.productId)
            ? { in: scope.productId }
            : scope.productId,
        },
      });
    }

    if (scope.productVariantId) {
      orFilters.push({
        id: Array.isArray(scope.productVariantId)
          ? { in: scope.productVariantId }
          : scope.productVariantId,
      });
    }

    // const productConditions: any = {};
    // if (scope.categoryId) productConditions.categoryId = scope.categoryId;
    // if (scope.subCategoryId)
    //   productConditions.subCategoryId = scope.subCategoryId;
    // if (scope.brandId) productConditions.brandId = scope.brandId;
    // if (scope.productId) productConditions.id = scope.productId;

    // const whereFilter: any = {
    //   ...(scope.productVariantId && { id: scope.productVariantId }),
    //   ...(Object.keys(productConditions).length > 0 && {
    //     product: {
    //       ...productConditions,
    //     },
    //   }),
    // };

    const productVariants = await tx.productVariant.findMany({
      where: {
        OR: orFilters.length > 0 ? orFilters : undefined,
      },
      select: {
        id: true,
        price: true,
        discountedPrice: true,
      },
    });

    for await (const variant of productVariants) {
      const offerApplied = await applyOfferToProducts({
        totalOrderAmount: variant.price,
        offer,
      });

      const finalPrice = offerApplied?.finalAmount ?? variant.price;

      await tx.productVariant.update({
        where: { id: variant.id },
        data: {
          discountedPrice: finalPrice,
        },
      });
    }

    return productVariants;
  } catch (error) {
    console.error("Error updating discounted price:", error);
    throw error;
  }
};

export const removeDiscountedPriceByScope = async (
  offer: Offer,
  scope: {
    categoryId?: string;
    brandId?: string;
    productId?: string;
    productVariantId?: string;
    subCategoryId?: string;
  },
  tx: Prisma.TransactionClient = prisma
) => {
  try {
    const productVariants = await tx.productVariant.findMany({
      where: {
        product: { categoryId: scope.categoryId },
        // OR: [
        //   ...(scope.productVariantId ? [{ id: scope.productVariantId }] : []),
        //   ...(scope.productId ? [{ product: { id: scope.productId } }] : []),
        //   ...(scope.categoryId
        //     ? [{ product: { categoryId: scope.categoryId } }]
        //     : []),
        //   ...(scope.subCategoryId
        //     ? [{ product: { subCategoryId: scope.subCategoryId } }]
        //     : []),
        //   ...(scope.brandId ? [{ product: { brandId: scope.brandId } }] : []),
        // ],
      },
      select: {
        id: true,
        price: true,
        discountedPrice: true,
      },
    });

    for await (const variant of productVariants) {
      await tx.productVariant.update({
        where: { id: variant.id },
        data: {
          discountedPrice: variant.price,
        },
      });
    }

    return productVariants;
  } catch (error) {
    console.error("Error updating discounted price:", error);
    throw error;
  }
};

export const updatedProductVariant = async (
  tx: Prisma.TransactionClient,
  productVariantId: string,
  quantity: number
) => {
  try {
    const updatedProductStock = await tx.productVariant.update({
      where: { id: productVariantId },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });

    return updatedProductStock;
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};

interface CreateProductInput {
  name: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
  brandId: string;
  images: string[]; // Assuming image URLs
  price: number;
  stock: number;
  unit: string;
  unitSize: number;
  cgst: number;
  sgst: number;
  igst: number;
  hsnCode: string;
}

export const createProduct = async (createProductObj: CreateProductInput) => {
  try {
    const {
      name,
      description,
      categoryId,
      images,
      brandId,
      subCategoryId,
      price,
      stock,
      unit,
      unitSize,
      cgst,
      hsnCode,
      igst,
      sgst,
    } = createProductObj;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        categoryId,
        images,
        brandId,
        subCategoryId,
        cgst,
        hsnCode,
        igst,
        sgst,
        variants: {
          create: {
            price,
            stock,
            unit,
            unitSize,
            discountedPrice: price,
          },
        },
      },
      include: {
        variants: true,
      },
    });

    return newProduct;
  } catch (error) {
    console.error("Failed to create product:", error);
    throw new Error("Product creation failed.");
  }
};
