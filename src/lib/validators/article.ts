import { z } from "zod";

export const upsertArticleSchema = z.object({
  title: z.string().min(5),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung."),
  category: z.enum(["Resep", "Tips", "Artikel"]).default("Artikel"),
  summary: z.string().optional().default(""),
  content: z.string().optional().default(""),
  readingTime: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  heroImageUrl: z.string().optional(),
  isPublished: z.coerce.boolean().optional().default(true),
});

export type UpsertArticleInput = z.infer<typeof upsertArticleSchema>;
