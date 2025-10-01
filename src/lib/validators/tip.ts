import { z } from "zod";

export const upsertTipSchema = z.object({
  title: z.string().min(5),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung."),
  detail: z.string().optional().default(""),
  duration: z.string().optional().default(""),
  isPublished: z.coerce.boolean().optional().default(true),
});

export type UpsertTipInput = z.infer<typeof upsertTipSchema>;
