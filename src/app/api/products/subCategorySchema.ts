import { z } from "zod";

export const subCategorySchema = z.object({
  name: z.string().min(1, "Sub-category name is required."),
  image: z.string().url("Image must be a valid URL."),
  categoryId: z.string().uuid("Category ID must be a valid UUID."),
});

export type SubCategoryInput = z.infer<typeof subCategorySchema>;
