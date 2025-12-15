import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true }, // Untuk URL cantik: /recipes/sup-ikan
  description: { type: String },
  image: { type: String },
  difficulty: { type: String, enum: ["Mudah", "Sedang", "Sulit"], default: "Mudah" },
  time: { type: String }, // Contoh: "30 Menit"
  ingredients: [String], // List bahan: ["500g Ikan", "2 siung bawang"]
  instructions: [String], // List cara masak
  
  // FITUR WOW: Relasi ke Produk
  // Resep ini merekomendasikan produk apa?
  relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  
  // Author/Pemilik resep
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  createdAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", RecipeSchema);

export default Recipe;