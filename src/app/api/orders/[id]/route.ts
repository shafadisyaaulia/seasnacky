import { NextRequest, NextResponse } from "next/server";
// import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import OrderModel, { Order } from "@/lib/models/Order";
import ProductModel from "@/lib/models/Product";
import { getAuthUser } from "@/lib/session";
import { updateOrderStatusSchema } from "@/lib/validators";

import { FilterQuery, Types } from "mongoose";
function orderQuery(identifier: string) {
  // Tentukan tipe array sebagai FilterQuery<Order>
  const candidates: FilterQuery<Order>[] = [{ code: identifier }];

  if (Types.ObjectId.isValid(identifier)) {
    candidates.unshift({ _id: identifier }); // ✅ type aman
  }

  return OrderModel.findOne({ $or: candidates });
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }

  const { id } = await context.params;
  await connectToDatabase();

  const order = await orderQuery(id).lean();
  if (!order) {
    return NextResponse.json({ message: "Pesanan tidak ditemukan." }, { status: 404 });
  }

  if (auth.role !== "admin" && String(order.user) !== auth.sub) {
    return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });
  }

  const productIds = order.items.map((item) => item.product);
  const products = await ProductModel.find({ _id: { $in: productIds } })
    .select("name slug imageUrl unit category")
    .lean();

  const productMap = new Map(products.map((product) => [String(product._id), product]));

  const items = order.items.map((item) => ({
    ...item,
    product: productMap.get(String(item.product)) ?? null,
  }));

  return NextResponse.json({
    data: {
      ...order,
      items,
    },
  });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await getAuthUser();
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Akses hanya untuk admin." }, { status: 403 });
  }

  const payload = await request.json().catch(() => undefined);
  if (!payload) {
    return NextResponse.json({ message: "Payload tidak valid." }, { status: 400 });
  }

  const parsed = updateOrderStatusSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Data status pesanan tidak valid.", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { id } = await context.params;
  await connectToDatabase();

  const order = await orderQuery(id);
  if (!order) {
    return NextResponse.json({ message: "Pesanan tidak ditemukan." }, { status: 404 });
  }

  order.status = parsed.data.status;
  if (parsed.data.paymentStatus) {
    order.paymentStatus = parsed.data.paymentStatus;
  }
  if (parsed.data.estimatedDelivery) {
    order.estimatedDelivery = new Date(parsed.data.estimatedDelivery);
  }
  if (parsed.data.trackingNumber) {
    order.metadata = {
      ...order.metadata,
      trackingNumber: parsed.data.trackingNumber,
    };
  }

  await order.save();

  return NextResponse.json({
    message: "Status pesanan diperbarui.",
    data: {
      id: order.id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      estimatedDelivery: order.estimatedDelivery,
      trackingNumber: order.metadata?.trackingNumber,
    },
  });
}