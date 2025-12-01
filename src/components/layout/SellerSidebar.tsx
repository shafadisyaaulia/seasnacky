"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, BookOpen, Settings, LogOut } from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Ikhtisar", href: "/dashboard/seller" },
  { icon: Package, label: "Produk Saya", href: "/dashboard/seller/products" },
  { icon: ShoppingBag, label: "Pesanan Masuk", href: "/dashboard/seller/orders" },
  { icon: BookOpen, label: "Konten Edukasi", href: "/dashboard/seller/content" }, // Fitur Wow
];

export default function SellerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r h-screen fixed left-0 top-0 flex flex-col z-10">
      {/* Logo Area */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">Seasnacky<span className="text-gray-400 text-sm">.Seller</span></h1>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? "bg-blue-50 text-blue-600 font-medium" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t">
        <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-lg transition-colors">
          <LogOut size={20} />
          Keluar
        </button>
      </div>
    </aside>
  );
}