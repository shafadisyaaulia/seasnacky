import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const ArticleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, enum: ["Resep", "Tips", "Artikel"], default: "Artikel" },
    summary: { type: String, default: "" },
    content: { type: String, default: "" },
    readingTime: { type: String, default: "" },
    heroImageUrl: { type: String, default: "" },
    tags: { type: [String], default: [] },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// ArticleSchema.index({ slug: 1 }, { unique: true });
ArticleSchema.index({ title: "text", summary: "text", tags: "text" });

export type Article = InferSchemaType<typeof ArticleSchema>;
export type ArticleModel = Model<Article>;

export default (models.Article as ArticleModel) || model<Article>("Article", ArticleSchema);
