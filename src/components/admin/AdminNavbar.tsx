"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, Users, Package, Activity, ArrowLeft } from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/admin" },
  { icon: Store, label: "Kelola Toko", href: "/dashboard/admin/shops" },
  { icon: Users, label: "Kelola User", href: "/dashboard/admin/users" },
  { icon: Package, label: "Kelola Produk", href: "/dashboard/admin/products" },
  { icon: Activity, label: "System Logs", href: "/dashboard/admin/logs" },
];

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <div className="bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-md sticky top-16 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 overflow-x-auto py-3">
          {/* Back to Home Button */}
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all mr-4 border border-gray-200"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Beranda</span>
          </Link>

          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/dashboard/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
                  ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  }
                `}
              >
                <item.icon size={18} className={`${isActive ? "scale-110" : "group-hover:scale-110"} transition-transform`} />
                <span className="whitespace-nowrap">{item.label}</span>
                
                {/* Underline animation untuk non-active */}
                {!isActive && (
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
