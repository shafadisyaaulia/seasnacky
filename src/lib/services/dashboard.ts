import { connectToDatabase } from "../db";
import OrderModel from "../models/Order";
import ProductModel from "../models/Product";
import UserModel from "../models/User";
import ReviewModel from "../models/Review";

// Menambahkan interface untuk memastikan tipe data yang lebih kuat
interface OrderMetric {
  _id: string | null;
  count: number;
  revenue?: number;
}

interface StatusMetric {
  _id: string | null;
  count: number;
}

export async function getDashboardSnapshot() {
  await connectToDatabase();

  const [orderMetrics, statusMetrics, topProducts, ratingLeaders, activeUsers, reviewCount] = await Promise.all([
    OrderModel.aggregate([
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$grandTotal", 0],
            },
          },
        },
      },
    ]),
    OrderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),
    OrderModel.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          revenue: { $sum: "$items.subtotal" },
          quantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          productId: "$product._id",
          name: "$product.name",
          slug: "$product.slug",
          revenue: 1,
          quantity: 1,
          averageRating: "$product.averageRating",
          reviewCount: "$product.reviewCount",
        },
      },
    ]),
    ProductModel.find({ isPublished: true })
      .sort({ averageRating: -1, reviewCount: -1 })
      .limit(5)
      .select("name slug averageRating reviewCount category")
      .lean(),
    UserModel.countDocuments({}),
    ReviewModel.countDocuments({}),
  ]);

  // PERBAIKAN: Menambahkan tipe eksplisit pada parameter 'sum' and 'item'
  const revenueTotal = (orderMetrics as OrderMetric[]).reduce((sum: number, item: OrderMetric) => sum + (item.revenue ?? 0), 0);

  // PERBAIKAN: Menambahkan tipe eksplisit pada parameter 'acc' and 'item'
  const orderStatus = (orderMetrics as OrderMetric[]).reduce<Record<string, number>>((acc: Record<string, number>, item: OrderMetric) => {
    acc[item._id ?? "unknown"] = item.count;
    return acc;
  }, {});

  // PERBAIKAN: Menambahkan tipe eksplisit pada parameter 'acc' and 'item'
  const fulfillmentStatus = (statusMetrics as StatusMetric[]).reduce<Record<string, number>>((acc: Record<string, number>, item: StatusMetric) => {
    acc[item._id ?? "unknown"] = item.count;
    return acc;
  }, {});

  return {
    summary: {
      totalRevenue: revenueTotal,
      orders: orderStatus,
      activeUsers,
      reviewCount,
      fulfillmentStatus,
    },
    topProducts,
    ratingLeaders,
  };
}