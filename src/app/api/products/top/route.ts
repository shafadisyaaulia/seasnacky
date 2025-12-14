import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Review from "@/models/Review";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    
    // Aggregate untuk menghitung rata-rata rating per produk
    const productsWithRating = await Review.aggregate([
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 }
        }
      },
      {
        $sort: { averageRating: -1, reviewCount: -1 }
      },
      {
        $limit: 3
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $unwind: "$productDetails"
      },
      {
        $project: {
          _id: "$productDetails._id",
          name: "$productDetails.name",
          price: "$productDetails.price",
          category: "$productDetails.category",
          description: "$productDetails.description",
          images: "$productDetails.images",
          countInStock: "$productDetails.countInStock",
          averageRating: 1,
          reviewCount: 1
        }
      }
    ]);

    // Jika tidak ada review, ambil 3 produk terbaru
    if (productsWithRating.length === 0) {
      const fallbackProducts = await Product.find().sort({ createdAt: -1 }).limit(3);
      return NextResponse.json({ data: fallbackProducts });
    }

    return NextResponse.json({ data: productsWithRating });
  } catch (error) {
    console.error("Error getting top products:", error);
    return NextResponse.json({ data: [] });
  }
}