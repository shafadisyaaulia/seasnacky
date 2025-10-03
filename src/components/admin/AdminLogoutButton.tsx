"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Hapus cookie "kartu akses" demo
    document.cookie = "demo_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Arahkan kembali ke halaman login admin
    router.push("/admin/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-blue-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-blue-600 transition hover:border-blue-500 hover:text-blue-700"
    >
      Logout
    </button>
  );
}