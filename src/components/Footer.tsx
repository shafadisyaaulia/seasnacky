"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-100 bg-white/70">
      <div className="site-container py-8 text-sm text-slate-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-sky-200 flex items-center justify-center text-sky-800 font-bold">S</div>
              <div className="text-lg font-semibold text-sky-800">SeaSnacky</div>
            </div>
            <div>© {new Date().getFullYear()} SeaSnacky — Semua hak dilindungi.</div>
          </div>

          <div className="flex gap-8">
            <div>
              <div className="font-semibold mb-2">Produk</div>
              <ul className="space-y-1">
                <li><a href="/marketplace" className="text-slate-600">Marketplace</a></li>
                <li><a href="#" className="text-slate-600">Promo</a></li>
              </ul>
            </div>

            <div>
              <div className="font-semibold mb-2">Perusahaan</div>
              <ul className="space-y-1">
                <li><a href="#" className="text-slate-600">Privasi</a></li>
                <li><a href="#" className="text-slate-600">Syarat</a></li>
              </ul>
            </div>
          </div>

          <div>
            <div className="font-semibold mb-2">Newsletter</div>
            <p className="text-slate-600 text-sm mb-2">Dapatkan promo & resep terbaru.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input aria-label="email" placeholder="Email Anda" className="flex-1 rounded-md border px-3 py-2" />
              <button className="px-3 py-2 rounded-md btn-primary">Daftar</button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
