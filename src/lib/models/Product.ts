import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, default: "" },
    description: { type: String, default: "" },
    tags: { type: [String], default: [] },
    stock: { type: Number, default: 0, min: 0 },
    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: true },
    seoKeywords: { type: [String], default: [] },
  },
  { timestamps: true },
);

ProductSchema.index({ name: "text", category: "text", tags: "text", description: "text" });
// ProductSchema.index({ slug: 1 }, { unique: true });

export type Product = InferSchemaType<typeof ProductSchema>;
export type ProductModel = Model<Product>;

export default (models.Product as ProductModel) || model<Product>("Product", ProductSchema);
