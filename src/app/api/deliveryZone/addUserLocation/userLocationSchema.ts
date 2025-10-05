import { z } from "zod";

export const userLocationSchema = z.object({
  latitude: z.string().min(-90).max(90),
  longitude: z.string().min(-180).max(180),
  city: z.string(),
  country: z.string(),
  zipCode: z.string(),
  state: z.string(),
});
