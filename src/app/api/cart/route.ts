import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";

export const dynamic = "force-dynamic";

// GET: Ambil isi keranjang user
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ data: [], meta: { total: 0 } });
    }

    const cart = await Cart.findOne({ userId }).populate('items.productId');
    
    if (!cart) {
      return NextResponse.json({ data: [], meta: { total: 0 } });
    }

    // Transform to match frontend format
    const items = cart.items.map((item: any) => ({
      productId: item.productId._id.toString(),
      quantity: item.quantity
    }));

    return NextResponse.json({ 
      data: items,
      meta: { total: items.length }
    });
  } catch (error: any) {
    console.error("Error GET Cart:", error);
    return NextResponse.json({ data: [], meta: { total: 0 } });
  }
}

// POST: Tambah ke keranjang
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const payload = await request.json();
    const { userId, productId, quantity } = payload;

    console.log("POST /api/cart:", { userId, productId, quantity });

    if (!userId || !productId) {
      return NextResponse.json(
        { message: "userId dan productId harus diisi" },
        { status: 400 }
      );
    }

    // Convert productId string to ObjectId
    const mongoose = require('mongoose');
    let productObjectId;
    try {
      productObjectId = new mongoose.Types.ObjectId(productId);
    } catch (e) {
      console.error("Invalid productId format:", productId);
      return NextResponse.json(
        { message: "Format productId tidak valid" },
        { status: 400 }
      );
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
      console.log("Created new cart for user:", userId);
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity || 1;
      console.log("Updated existing item quantity:", cart.items[existingItemIndex]);
    } else {
      // Add new item
      cart.items.push({ productId: productObjectId, quantity: quantity || 1 });
      console.log("Added new item to cart");
    }

    await cart.save();
    console.log("Cart saved successfully. Total items:", cart.items.length);

    return NextResponse.json({ 
      message: "Berhasil ditambahkan ke keranjang",
      item: { userId, productId, quantity },
      totalItems: cart.items.length
    });
  } catch (error: any) {
    console.error("Error POST Cart:", error);
    return NextResponse.json(
      { message: "Gagal menambahkan ke keranjang: " + error.message },
      { status: 500 }
    );
  }
}

// DELETE: Hapus item dari keranjang
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");
    const productId = searchParams.get("productId");

    if (!userId) {
      return NextResponse.json(
        { message: "userId harus diisi" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return NextResponse.json({ message: "Keranjang tidak ditemukan" }, { status: 404 });
    }

    if (productId) {
      // Remove specific item
      cart.items = cart.items.filter((item: any) => item.productId.toString() !== productId);
    } else {
      // Clear all items
      cart.items = [];
    }

    await cart.save();

    return NextResponse.json({ message: "Berhasil menghapus item" });
  } catch (error: any) {
    console.error("Error DELETE Cart:", error);
    return NextResponse.json(
      { message: "Gagal menghapus item." },
      { status: 500 }
    );
  }
}