import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import Product from "@/models/Product"; // Kita butuh ini buat nyambungin produk

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    // 1. Cek apakah sudah ada resep?
    let recipes = await Recipe.find().populate("relatedProducts");

    // 2. JIKA KOSONG -> KITA BUATKAN DATA DUMMY OTOMATIS (AUTO SEED)
    if (recipes.length === 0) {
      console.log("⚡ Database Resep kosong. Membuat data dummy otomatis...");
      
      // Cari 1 produk acak buat disambungin (misal produk Bakso tadi)
      const randomProduct = await Product.findOne(); 
      
      if (randomProduct) {
        await Recipe.create({
          title: "Sup Bakso Ikan Segar Kuah Bening",
          slug: "sup-bakso-ikan-segar",
          description: "Hidangan hangat dan sehat, cocok untuk makan malam keluarga. Menggunakan bakso ikan asli tanpa pengawet.",
          image: "https://images.unsplash.com/photo-1548943487-a2e4e43b485c?auto=format&fit=crop&w=800&q=80", // Gambar dummy unsplash
          difficulty: "Mudah",
          time: "15 Menit",
          ingredients: [
            "1 Bungkus Bakso Ikan SeaSnacky",
            "2 siung bawang putih, geprek",
            "1 batang daun bawang",
            "Garam & Lada secukupnya",
            "500ml air kaldu"
          ],
          instructions: [
            "Rebus air kaldu hingga mendidih.",
            "Masukkan bawang putih geprek, tunggu hingga harum.",
            "Masukkan Bakso Ikan SeaSnacky, masak hingga mengapung.",
            "Tambahkan garam, lada, dan daun bawang.",
            "Sajikan selagi hangat."
          ],
          relatedProducts: [randomProduct._id] // <--- INI KUNCINYA! Nyambung ke produk kamu
        });
        
        // Ambil lagi data yang baru dibuat
        recipes = await Recipe.find().populate("relatedProducts");
      }
    }

    return NextResponse.json(recipes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal ambil resep" }, { status: 500 });
  }
}