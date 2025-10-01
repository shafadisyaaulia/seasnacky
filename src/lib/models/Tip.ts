import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const TipSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    detail: { type: String, default: "" },
    duration: { type: String, default: "" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

TipSchema.index({ slug: 1 }, { unique: true });
TipSchema.index({ title: "text", detail: "text" });

export type Tip = InferSchemaType<typeof TipSchema>;
export type TipModel = Model<Tip>;

export default (models.Tip as TipModel) || model<Tip>("Tip", TipSchema);
