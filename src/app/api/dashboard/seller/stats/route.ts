import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Shop from "@/models/Shop";
import { getAuthUser } from "@/lib/session";

// GET - Dashboard statistics for seller
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

    // Cek apakah user adalah seller
    if (user.role !== "SELLER" && user.role !== "seller") {
      return NextResponse.json(
        { message: "Akses ditolak. Hanya untuk seller." },
        { status: 403 }
      );
    }

    // Cari shop milik seller ini
    const shop = await Shop.findOne({ sellerId: user.sub });
    
    if (!shop) {
      return NextResponse.json({
        stats: {
          totalRevenue: 0,
          activeProducts: 0,
          newOrders: 0,
          totalOrders: 0,
        },
        hasShop: false,
      });
    }

    // Convert user.sub (string) to ObjectId
    const sellerObjectId = new mongoose.Types.ObjectId(user.sub);

    // Hitung produk aktif (gunakan sellerId dan countInStock)
    const activeProducts = await Product.countDocuments({ 
      sellerId: sellerObjectId,
      countInStock: { $gt: 0 }
    });

    // Hitung pesanan baru (status pending atau paid)
    const newOrders = await Order.countDocuments({
      sellerId: sellerObjectId,
      status: { $in: ["pending", "paid"] }
    });

    // Hitung total pesanan
    const totalOrders = await Order.countDocuments({
      sellerId: sellerObjectId
    });

    // Hitung total pendapatan (dari pesanan completed atau paid)
    const revenueResult = await Order.aggregate([
      {
        $match: {
          sellerId: sellerObjectId,
          status: { $in: ["paid", "completed"] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    return NextResponse.json({
      stats: {
        totalRevenue,
        activeProducts,
        newOrders,
        totalOrders,
      },
      hasShop: true,
      shopName: shop.name,
      shopStatus: shop.status,
      shopAddress: shop.address,
      shopDescription: shop.description,
      shopBankName: shop.bankName,
      shopBankAccountNumber: shop.bankAccountNumber,
      shopBankAccountName: shop.bankAccountName,
    });

  } catch (error) {
    console.error("Error fetching seller stats:", error);
    return NextResponse.json(
      { message: "Gagal mengambil statistik" },
      { status: 500 }
    );
  }
}
