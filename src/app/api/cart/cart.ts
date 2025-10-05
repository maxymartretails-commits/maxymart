import { prisma } from "@/lib/prisma";

export async function addToCart(
  userId: string,
  productId: string,
  variantId: string | null,
  quantity: number
) {
  const existing = await prisma.cartItem.findFirst({
    where: { userId, productId, productVariantId: variantId },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        userId,
        productId,
        productVariantId: variantId!,
        quantity,
      },
    });
  }
}
