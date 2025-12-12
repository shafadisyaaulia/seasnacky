import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, default: 1, min: 1 }
});

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // Bisa ObjectId atau string untuk guest
  items: [CartItemSchema]
}, {
  timestamps: true // Otomatis handle createdAt dan updatedAt
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

export default Cart;
