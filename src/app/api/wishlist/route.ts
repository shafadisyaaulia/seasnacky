import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";
import { getAuthUser } from "@/lib/session";

// GET - Fetch user's wishlist
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    // Fetch wishlist dengan populate product data
    const wishlist = await Wishlist.find({ userId: user.sub })
      .populate({
        path: 'productId',
        select: 'name slug price images description category countInStock',
      })
      .sort({ createdAt: -1 })
      .lean();

    // Filter out items dengan produk yang sudah dihapus
    const validWishlist = wishlist.filter((item: any) => item.productId);

    return NextResponse.json({
      wishlist: validWishlist,
      total: validWishlist.length,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { message: "Gagal mengambil wishlist" },
      { status: 500 }
    );
  }
}

// POST - Add product to wishlist
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
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID diperlukan" },
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

    // Check if already in wishlist
    const existing = await Wishlist.findOne({
      userId: user.sub,
      productId,
    });

    if (existing) {
      return NextResponse.json(
        { message: "Produk sudah ada di wishlist", inWishlist: true },
        { status: 200 }
      );
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      userId: user.sub,
      productId,
    });

    return NextResponse.json(
      {
        message: "Ditambahkan ke wishlist",
        wishlistItem,
        inWishlist: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding to wishlist:", error);

    // Handle duplicate error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Produk sudah ada di wishlist", inWishlist: true },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Gagal menambahkan ke wishlist" },
      { status: 500 }
    );
  }
}

// DELETE - Remove product from wishlist
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
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID diperlukan" },
        { status: 400 }
      );
    }

    // Remove from wishlist
    const result = await Wishlist.findOneAndDelete({
      userId: user.sub,
      productId,
    });

    if (!result) {
      return NextResponse.json(
        { message: "Item tidak ditemukan di wishlist" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Dihapus dari wishlist",
      inWishlist: false,
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { message: "Gagal menghapus dari wishlist" },
      { status: 500 }
    );
  }
}
