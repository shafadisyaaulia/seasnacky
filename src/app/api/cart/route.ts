import { NextRequest, NextResponse } from "next/server";
import type { HydratedDocument } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import CartModel, { type Cart } from "@/lib/models/Cart";
import ProductModel from "@/lib/models/Product";
import { getAuthUser } from "@/lib/session";

type CartDocument = HydratedDocument<Cart>;

async function recalcSubtotal(cart: CartDocument | null) {
  if (!cart) return 0;
  cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  await cart.save();
  return cart.subtotal;
}

export async function GET(request: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }

  const userId = request.nextUrl.searchParams.get("userId") ?? auth.sub;
  if (auth.role !== "admin" && auth.sub !== userId) {
    return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  }

  await connectToDatabase();

  const cart = await CartModel.findOne({ user: userId })
    .populate("items.product", "name slug price unit imageUrl stock")
    .lean();

  return NextResponse.json({
    data: cart ?? { user: userId, items: [], subtotal: 0 },
  });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }

  const payload = await request.json().catch(() => undefined);
  if (!payload) {
    return NextResponse.json({ message: "Payload tidak valid." }, { status: 400 });
  }

  const { productId, quantity } = payload as { productId?: string; quantity?: number };
  if (!productId) {
    return NextResponse.json({ message: "productId wajib diisi." }, { status: 422 });
  }

  const qty = Math.max(1, Number(quantity) || 1);

  await connectToDatabase();

  const product = await ProductModel.findOne({
    $or: [{ _id: productId }, { slug: productId }],
  });
  if (!product) {
    return NextResponse.json({ message: "Produk tidak ditemukan." }, { status: 404 });
  }

  const cart = await CartModel.findOneAndUpdate(
    { user: auth.sub },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  if (!cart) {
    throw new Error("Gagal membuat keranjang pengguna.");
  }

  // if (!Array.isArray(cart.items)) {
  //   cart.items = [];
  // }
  cart.items.splice(0); // tetap DocumentArray

  const existingItem = cart.items.find((item) => String(item.product) === String(product._id));
  if (existingItem) {
    existingItem.quantity += qty;
    existingItem.price = product.price;
  } else {
    cart.items.push({
      product: product._id,
      quantity: qty,
      price: product.price,
    });
  }

  await recalcSubtotal(cart);

  const populated = await cart.populate("items.product", "name slug price unit imageUrl stock");

  return NextResponse.json({
    message: "Produk ditambahkan ke keranjang.",
    data: populated,
  });
}

export async function DELETE(request: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }

  const productId = request.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ message: "productId wajib diisi." }, { status: 422 });
  }

  await connectToDatabase();

  const cart = await CartModel.findOne({ user: auth.sub });
  if (!cart) {
    return NextResponse.json({ message: "Keranjang kosong." }, { status: 404 });
  }

  if (cart.items) {
  for (let i = cart.items.length - 1; i >= 0; i--) {
    if (String(cart.items[i].product) === productId) {
      cart.items.splice(i, 1); // hapus 1 item di index i
    }
  }
}
await recalcSubtotal(cart);

  return NextResponse.json({ message: "Produk dihapus dari keranjang." });
}
