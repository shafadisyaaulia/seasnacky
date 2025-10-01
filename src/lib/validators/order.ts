import { z } from "zod";

export const checkoutSchema = z.object({
  userId: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().min(1),
      }),
    )
    .min(1, "Tambahkan minimal satu produk."),
  shippingAddress: z.string().min(10),
  notes: z.string().optional(),
  paymentMethod: z.string().min(3).default("virtual_account"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "diproses", "dikirim", "selesai", "dibatalkan"]),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  trackingNumber: z.string().optional(),
  estimatedDelivery: z.string().optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
