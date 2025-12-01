"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, BookOpen, LogOut } from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Ikhtisar", href: "/dashboard/seller" },
  { icon: Package, label: "Produk Saya", href: "/dashboard/seller/products" },
  { icon: ShoppingBag, label: "Pesanan Masuk", href: "/dashboard/seller/orders" },
  { icon: BookOpen, label: "Konten Edukasi", href: "/dashboard/seller/content" },
];

export default function SellerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
      router.push("/login");
    } catch (error) {
      console.error("Gagal logout", error);
    }
  };

  return (
    // Class 'fixed' membuat dia diam di kiri, 'z-50' memastikannya di atas elemen lain
    <aside className="w-64 bg-white border-r h-screen fixed left-0 top-0 flex flex-col z-50 shadow-lg">
      
      {/* Logo Area */}
      <div className="p-6 border-b h-16 flex items-center">
        <h1 className="text-2xl font-bold text-blue-600">Seasnacky<span className="text-gray-400 text-sm">.Seller</span></h1>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          // Cek apakah link aktif (bisa exact match atau startWith untuk sub-halaman)
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                isActive 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t bg-gray-50/50">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 w-full rounded-lg transition-colors font-medium"
        >
          <LogOut size={20} />
          Keluar
        </button>
      </div>
    </aside>
  );
}