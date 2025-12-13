import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { getAuthUser } from "@/lib/session";

// GET - Fetch reviews for a product
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID diperlukan" },
        { status: 400 }
      );
    }

    // Fetch all reviews for this product
    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .lean();

    // Calculate stats
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    // Distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      distribution[r.rating as keyof typeof distribution]++;
    });

    return NextResponse.json({
      reviews,
      stats: {
        totalReviews,
        averageRating,
        distribution,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Gagal mengambil reviews" },
      { status: 500 }
    );
  }
}

// POST - Create new review
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, rating, comment } = body;

    // Validasi input
    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { message: "Product ID, rating, dan comment diperlukan" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating harus antara 1-5" },
        { status: 400 }
      );
    }

    if (comment.trim().length < 10) {
      return NextResponse.json(
        { message: "Review minimal 10 karakter" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      userId: user.sub,
      productId,
    });

    if (existingReview) {
      return NextResponse.json(
        { message: "Anda sudah memberikan review untuk produk ini" },
        { status: 400 }
      );
    }

    // Create new review
    const newReview = await Review.create({
      productId,
      userId: user.sub, // user.sub adalah ID dari session
      userName: user.name,
      userEmail: user.email,
      rating,
      comment: comment.trim(),
      verified: false, // TODO: Set true jika user sudah beli produk
    });

    return NextResponse.json(
      { message: "Review berhasil ditambahkan", review: newReview },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating review:", error);
    
    // Handle duplicate review error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Anda sudah memberikan review untuk produk ini" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Gagal menambahkan review" },
      { status: 500 }
    );
  }
}

// PUT - Update review
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reviewId, rating, comment } = body;

    if (!reviewId) {
      return NextResponse.json(
        { message: "Review ID diperlukan" },
        { status: 400 }
      );
    }

    // Find review
    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json(
        { message: "Review tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check ownership
    if (review.userId.toString() !== user.sub.toString()) {
      return NextResponse.json(
        { message: "Anda tidak memiliki akses untuk mengedit review ini" },
        { status: 403 }
      );
    }

    // Update review
    if (rating) {
      if (rating < 1 || rating > 5) {
        return NextResponse.json(
          { message: "Rating harus antara 1-5" },
          { status: 400 }
        );
      }
      review.rating = rating;
    }

    if (comment) {
      if (comment.trim().length < 10) {
        return NextResponse.json(
          { message: "Review minimal 10 karakter" },
          { status: 400 }
        );
      }
      review.comment = comment.trim();
    }

    await review.save();

    return NextResponse.json({
      message: "Review berhasil diupdate",
      review,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { message: "Gagal mengupdate review" },
      { status: 500 }
    );
  }
}

// DELETE - Delete review
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json(
        { message: "Review ID diperlukan" },
        { status: 400 }
      );
    }

    // Find review
    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json(
        { message: "Review tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check ownership
    if (review.userId.toString() !== user.sub.toString()) {
      return NextResponse.json(
        { message: "Anda tidak memiliki akses untuk menghapus review ini" },
        { status: 403 }
      );
    }

    await Review.findByIdAndDelete(reviewId);

    return NextResponse.json({
      message: "Review berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { message: "Gagal menghapus review" },
      { status: 500 }
    );
  }
}