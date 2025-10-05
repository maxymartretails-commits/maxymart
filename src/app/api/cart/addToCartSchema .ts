import z from "zod";


export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  productVariantId: z.string().uuid().optional(),
  quantity: z.number().int().min(0),
});
