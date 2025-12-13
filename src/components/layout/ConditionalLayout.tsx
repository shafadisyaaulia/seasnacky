"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Semua halaman pakai Header & Footer (termasuk dashboard)
  return (
    <>
      <Header />
      <div className="min-h-[60vh]">{children}</div>
      <Footer />
    </>
  );
}
