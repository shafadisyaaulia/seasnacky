import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z.string().min(1),
  orderId: z.string().optional(),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(5).max(1000),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
