import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(1, "store name is required"),
  mapLink: z.string().url("invalid map link").optional().nullable(),
  zoneId: z.string().uuid("invalid zone id"),
  latitude: z.number().refine((val) => val >= -90 && val <= 90, {
    message: "latitude must be between -90 and 90",
  }),
  longitude: z.number().refine((val) => val >= -180 && val <= 180, {
    message: "longitude must be between -180 and 180",
  }),
});
