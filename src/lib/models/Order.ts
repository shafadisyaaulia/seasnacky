import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    productSlug: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "diproses", "dikirim", "selesai", "dibatalkan"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    items: { type: [OrderItemSchema], default: [] },
    total: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, default: 0, min: 0 },
    grandTotal: { type: Number, required: true, min: 0 },
    estimatedDelivery: { type: Date },
    shippingAddress: { type: String, required: true },
    notes: { type: String, default: "" },
    paymentMethod: { type: String, default: "midtrans" },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

// OrderSchema.index({ code: 1 }, { unique: true });
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

export type OrderItem = InferSchemaType<typeof OrderItemSchema>;
export type Order = InferSchemaType<typeof OrderSchema>;
export type OrderModel = Model<Order>;

export default (models.Order as OrderModel) || model<Order>("Order", OrderSchema);
