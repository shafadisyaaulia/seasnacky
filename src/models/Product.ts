import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ["mentah", "olahan"], required: true },
  description: String,
  images: [String],
  createdAt: { type: Date, default: Date.now },
});

// PERBAIKAN DISINI:
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;