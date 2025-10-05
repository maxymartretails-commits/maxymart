import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string().uuid(),
  subCategoryId: z.string().uuid(),
  brandId: z.string().uuid(),
  images: z.array(z.string().url()),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  unit: z.string().min(1),
  unitSize: z.number().int().nonnegative(),
  cgst: z.number().nonnegative(),
  sgst: z.number().nonnegative(),
  igst: z.number().nonnegative(),
  hsnCode: z.string().min(1),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
