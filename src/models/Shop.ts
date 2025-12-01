import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  image: { type: String },
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// PERBAIKAN DISINI:
const Shop = mongoose.models.Shop || mongoose.model("Shop", ShopSchema);

export default Shop;