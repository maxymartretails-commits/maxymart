import { z } from "zod";

const validMethods = ["cod", "upi", "card"] as const;
export const productOrderSchema = z.object({
  products: z
    .array(
      z.object({
        productId: z.string().uuid(),
        productVariantId: z.string().uuid(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "At least one product must be included in the order"),
  paymentMethod: z.enum(validMethods),
  deliveryFee: z.number().nonnegative(),
  street: z.string().min(1),
  offerId: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  zipCode: z.string().min(4),
});
