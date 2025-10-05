import { z } from "zod";

export const deliveryZoneSchema = z.object({
  latitude: z.string().min(-90).max(90),
  longitude: z.string().min(-180).max(180),
  radiusKm: z.number().min(0.1),
  zoneName: z.string().min(1),
  state: z.string(),
  district: z.string()
});
