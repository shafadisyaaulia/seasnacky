import { connectToDatabase } from "../db";
import OrderModel from "../models/Order";
import ProductModel from "../models/Product";
import UserModel from "../models/User";
import ReviewModel from "../models/Review";

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

  const revenueTotal = orderMetrics.reduce((sum, item) => sum + (item.revenue ?? 0), 0);
  const orderStatus = orderMetrics.reduce<Record<string, number>>((acc, item) => {
    acc[item._id ?? "unknown"] = item.count;
    return acc;
  }, {});

  const fulfillmentStatus = statusMetrics.reduce<Record<string, number>>((acc, item) => {
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
