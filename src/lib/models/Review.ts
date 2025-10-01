import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const ReviewSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    isVerifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true },
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

export type Review = InferSchemaType<typeof ReviewSchema>;
export type ReviewModel = Model<Review>;

export default (models.Review as ReviewModel) || model<Review>("Review", ReviewSchema);
