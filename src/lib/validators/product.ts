import { z } from "zod";

export const upsertProductSchema = z.object({
  name: z.string().min(3),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung."),
  category: z.string().min(2),
  price: z.coerce.number().min(0),
  unit: z.string().optional().default(""),
  description: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  stock: z.coerce.number().int().min(0),
  imageUrl: z.string().optional(),
  imagePublicId: z.string().optional(),
  isPublished: z.coerce.boolean().optional().default(true),
});

export type UpsertProductInput = z.infer<typeof upsertProductSchema>;
