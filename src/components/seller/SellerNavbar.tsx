"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, BookOpen, DollarSign } from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Ikhtisar", href: "/dashboard/seller", badge: null },
  { icon: Package, label: "Produk", href: "/dashboard/seller/products", badge: "products" },
  { icon: ShoppingBag, label: "Pesanan Masuk", href: "/dashboard/seller/orders", badge: "orders" },
  { icon: BookOpen, label: "Resep Saya", href: "/dashboard/seller/content", badge: null },
  { icon: DollarSign, label: "Pendapatan", href: "/dashboard/seller/revenue", badge: null },
];

export default function SellerNavbar() {
  const pathname = usePathname();
  const [badges, setBadges] = useState({ products: 0, orders: 0 });

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const res = await fetch("/api/dashboard/seller/stats");
      const data = await res.json();
      if (res.ok && data.stats) {
        setBadges({
          products: data.stats.activeProducts || 0,
          orders: data.stats.newOrders || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching badges:", error);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border-b border-cyan-100 shadow-md sticky top-16 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 overflow-x-auto py-3">
          {menuItems.map((item) => {
            // Exact match untuk ikhtisar, startsWith untuk sub-pages
            const isActive = 
              pathname === item.href || 
              (item.href !== "/dashboard/seller" && pathname.startsWith(item.href));

            const badgeCount = item.badge ? badges[item.badge as keyof typeof badges] : 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap font-semibold text-sm relative group ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-cyan-50 hover:text-cyan-700"
                }`}
              >
                <item.icon size={18} className={isActive ? "" : "group-hover:scale-110 transition-transform"} />
                {item.label}
                {item.badge && badgeCount > 0 && (
                  <span className={`ml-1 px-2 py-0.5 text-xs rounded-full font-bold shadow-sm ${
                    isActive 
                      ? "bg-white/20 text-white"
                      : item.badge === "orders" 
                        ? "bg-orange-100 text-orange-700" 
                        : "bg-green-100 text-green-700"
                  }`}>
                    {badgeCount}
                  </span>
                )}
                {!isActive && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
