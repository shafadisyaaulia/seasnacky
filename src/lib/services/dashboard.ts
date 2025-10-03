import {
  getDashboardSummary as getMockDashboardSummary,
  getTopProducts,
  listProducts,
  users,
  listReviews,
  listOrders,
} from "@/app/api/_data/mockData";

export async function getDashboardSnapshot() {
  const summary = getMockDashboardSummary();
  const topProducts = getTopProducts();
  const ratingLeaders = listProducts()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const fulfillmentStatus: Record<string, number> = listOrders().reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    summary: {
      totalRevenue: summary.revenue,
      activeUsers: summary.activeUsers,
      reviewCount: listReviews().length,
      orders: {
        paid: listOrders().filter((o) => o.paymentStatus === "paid").length,
        pending: listOrders().filter((o) => o.paymentStatus === "pending")
          .length,
      },
      fulfillmentStatus,
    },
    topProducts: topProducts.map((p) => ({
      ...p,
      quantity:
        listOrders()
          .flatMap((o) => o.items)
          .filter((item) => item.productId === p.id)
          .reduce((sum, item) => sum + item.quantity, 0) || 0,
      revenue:
        listOrders()
          .flatMap((o) => o.items)
          .filter((item) => item.productId === p.id)
          .reduce((sum, item) => sum + item.price, 0) || 0,
    })),
    ratingLeaders,
  };
}