"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function UserOrdersPage() {
  const [me, setMe] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r1 = await fetch("/api/me");
        const j1 = await r1.json();
        const user = j1.data ?? null;
        if (!mounted) return;
        setMe(user);
        const r2 = await fetch("/api/orders");
        const j2 = await r2.json();
        const all = Array.isArray(j2) ? j2 : j2.data ?? j2;
        if (!mounted) return;
        const my = (all ?? []).filter((o: any) => o.userId === user?.id);
        setOrders(my);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Riwayat Pesanan</h1>
      {orders.length === 0 ? (
        <p className="text-sm text-slate-500">Belum ada pesanan.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-lg border p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{order.id}</p>
                <p className="text-xs text-slate-500">Total: Rp {order.total?.toLocaleString?.("id-ID") ?? order.total}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-600">{order.paymentStatus}</div>
                <Link href={`/user/orders/${order.id}`} className="text-sm text-sky-700">Detail</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
