"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const [items, setItems] = useState<any[]>([]);
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [provinces, setProvinces] = useState<Array<{id: string, name: string}>>([]);
  const [provinceId, setProvinceId] = useState<string>("");
  const [cities, setCities] = useState<Array<{id: string, name: string}>>([]);
  const [cityId, setCityId] = useState<string>("");
  const [products, setProducts] = useState<Record<string, any>>({});
  const [isDirect, setIsDirect] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    // Check if it's direct buy
    const urlParams = new URLSearchParams(window.location.search);
    const directParam = urlParams.get("direct");
    
    if (directParam === "true") {
      const directBuyData = sessionStorage.getItem("directBuy");
      if (directBuyData) {
        try {
          const data = JSON.parse(directBuyData);
          setItems([{ productId: data.productId, quantity: data.quantity }]);
          setIsDirect(true);
        } catch (e) {
          console.error("Failed to parse direct buy data:", e);
        }
      }
    } else {
      // Use cart items
      setItems(cart.items || []);
      setIsDirect(false);
    }
    
    fetch("/api/me")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        console.log("User data from /api/me:", json);
        const u = json.data ?? null;
        console.log("Parsed user:", u);
        setMe(u);
        if (u?.address) setAddress(u.address);
      })
      .catch(() => {})
      .finally(() => {
        if (!mounted) return;
      });
    fetch("/api/products")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        const list = Array.isArray(json) ? json : json.data ?? json;
        const map: Record<string, any> = {};
        (list ?? []).forEach((p: any) => {
          // Support both _id (MongoDB) and id
          const productId = p._id || p.id;
          map[productId] = p;
        });
        setProducts(map);
      })
      .catch(() => {});
    fetch("/api/regions/provinces")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setProvinces(json.data ?? []);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [cart.items]);

  useEffect(() => {
    if (!provinceId) {
      setCities([]);
      setCityId("");
      return;
    }
    console.log("Fetching cities for province:", provinceId);
    fetch(`/api/regions/cities?provinceId=${provinceId}`)
      .then((r) => r.json())
      .then((json) => {
        console.log("Cities response:", json);
        console.log("Cities data:", json.data);
        console.log("Cities array length:", json.data?.length);
        setCities(json.data ?? []);
        setCityId("");
      })
      .catch((err) => {
        console.error("Error fetching cities:", err);
        setCities([]);
        setCityId("");
      });
  }, [provinceId]);

  const handleCheckout = async () => {
    // Re-fetch user data to make sure
    try {
      const userRes = await fetch("/api/me");
      const userData = await userRes.json();
      let currentUser = userData.data;
      
      // Jika tidak ada user dari API, coba ambil dari localStorage atau buat guest user
      if (!currentUser) {
        // Cek localStorage untuk fallback
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            currentUser = JSON.parse(storedUser);
            console.log("Using user from localStorage:", currentUser);
          } catch (e) {
            console.error("Failed to parse stored user");
          }
        }
        
        // Jika masih tidak ada, buat guest user sementara
        if (!currentUser) {
          currentUser = {
            id: "guest-" + Date.now(),
            name: fullName || "Guest User",
            email: "guest@seasnacky.com"
          };
          console.log("Using guest user:", currentUser);
        }
      }
      
      setMe(currentUser);
      
      if (!items || items.length === 0) {
        alert("Tidak ada produk untuk checkout.");
        return;
      }
      
      // Validasi form
      if (!fullName.trim()) {
        alert("Mohon isi nama lengkap.");
        return;
      }
      if (!phone.trim()) {
        alert("Mohon isi nomor telepon.");
        return;
      }
      if (!provinceId) {
        alert("Mohon pilih provinsi.");
        return;
      }
      if (!cityId) {
        alert("Mohon pilih kota/kabupaten.");
        return;
      }
      if (!address.trim()) {
        alert("Mohon isi alamat lengkap.");
        return;
      }
      
      setLoading(true);
      
      const selectedProvince = provinces.find(p => p.id === provinceId);
      const selectedCity = cities.find(c => c.id === cityId);
      
      const fullAddress = `${address}, ${selectedCity?.name}, ${selectedProvince?.name}`;
      
      const payload = {
        userId: currentUser.id,
        items: items.map((it: any) => ({ productId: it.productId, quantity: it.quantity })),
        shippingAddress: fullAddress,
        recipientName: fullName,
        recipientPhone: phone,
      };
      
      console.log("Checkout payload:", payload);
      
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "checkout failed");
      }
      const data = await res.json();
      
      // Save order to localStorage for guest users
      if (isDirect) {
        sessionStorage.removeItem("directBuy");
        localStorage.setItem(`order_${data.id}`, JSON.stringify(data));
      }
      
      // Clear cart only if not direct buy
      if (!isDirect && cart?.clear) {
        cart.clear();
      }
      
      router.push(`/user/orders/${data.id}`);
    } catch (err) {
      console.error("Checkout error:", err);
      const errorMessage = err instanceof Error ? err.message : "Gagal melakukan checkout.";
      alert(errorMessage + " Silakan coba lagi.");
      setLoading(false);
    }
  };

  const subtotal = items.reduce((s: number, it: any) => s + (products[it.productId]?.price ?? 0) * it.quantity, 0);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
              <p className="text-sm text-gray-500 mt-1">
                {isDirect ? "Pembelian Langsung" : "Dari Keranjang"} • {items.length} item
              </p>
            </div>
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form Section */}
          <section className="lg:col-span-2 space-y-6">
            {/* Alamat Pengiriman */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Alamat Pengiriman
                </h2>
              </div>
              <div className="p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <input 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama Lengkap" 
                    className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                  <input 
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nomor Telepon" 
                    className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                  <select
                    className="rounded-lg border border-gray-300 px-4 py-3 md:col-span-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={provinceId}
                    onChange={(e) => setProvinceId(e.target.value)}
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map((prov) => (
                      <option key={prov.id} value={prov.id}>{prov.name}</option>
                    ))}
                  </select>
                  <select
                    className="rounded-lg border border-gray-300 px-4 py-3 md:col-span-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}
                    disabled={!provinceId || cities.length === 0}
                  >
                    <option value="">
                      {!provinceId ? "Pilih provinsi terlebih dahulu" : cities.length === 0 ? "Memuat kota..." : "Pilih Kota/Kabupaten"}
                    </option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                  <textarea 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    placeholder="Alamat lengkap (nama jalan, nomor rumah, RT/RW, kode pos, patokan)" 
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 min-h-[100px] md:col-span-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" 
                  />
                </div>
                <div className="mt-4 flex items-start gap-2 text-xs text-blue-600 bg-blue-50 rounded-lg p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Pastikan alamat lengkap dan nomor telepon aktif untuk pengiriman yang lancar.</span>
                </div>
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Metode Pembayaran
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-blue-600" />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Transfer Bank</div>
                        <div className="text-xs text-gray-500">BCA, BNI, Mandiri</div>
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input type="radio" name="payment" className="w-4 h-4 text-blue-600" />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">COD (Bayar di Tempat)</div>
                        <div className="text-xs text-gray-500">Tersedia untuk area tertentu</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Summary Section */}
          <aside className="space-y-6">
            {/* Ringkasan Produk */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">Ringkasan Pesanan</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="text-center py-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <p className="text-sm text-gray-500">Tidak ada produk</p>
                    </div>
                  ) : (
                    items.map((it: any) => {
                      const p = products[it.productId];
                      return (
                        <div key={it.productId} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {p?.image || p?.images?.[0] ? (
                              <Image 
                                src={p.image || p.images[0]} 
                                alt={p.name} 
                                width={64} 
                                height={64} 
                                className="object-cover w-full h-full" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">{p?.name ?? "Produk"}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {it.quantity} × Rp {(p?.price ?? 0).toLocaleString("id-ID")}
                            </p>
                            <p className="text-sm font-medium text-blue-600 mt-1">
                              Rp {((p?.price ?? 0) * it.quantity).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({items.length} item)</span>
                    <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Ongkos Kirim</span>
                    <span className="text-gray-400">Gratis</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-base font-semibold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout} 
                  disabled={loading || items.length === 0}
                  className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg px-6 py-4 font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    "Bayar Sekarang"
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pembayaran aman & terenkripsi
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
