import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const CartItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const CartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: { type: [CartItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// CartSchema.index({ user: 1 }, { unique: true });

export type CartItem = InferSchemaType<typeof CartItemSchema>;
export type Cart = InferSchemaType<typeof CartSchema>;
export type CartModel = Model<Cart>;

export default (models.Cart as CartModel) || model<Cart>("Cart", CartSchema);
