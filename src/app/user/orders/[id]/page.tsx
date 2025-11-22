"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    (async () => {
      try {
        const r = await fetch(`/api/orders/${id}`);
        if (!mounted) return;
        const j = await r.json();
        const data = j ?? j.data ?? null;
        setOrder(data);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!order) {
    return (
      <main className="max-w-4xl mx-auto py-10 px-4">
        <p>Memuat pesanan...</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-4">Detail Pesanan {order.id}</h1>
      <div className="rounded-lg border p-4">
        <p className="text-sm">Status: <strong>{order.status}</strong></p>
        <p className="text-sm">Pembayaran: <strong>{order.paymentStatus}</strong></p>
        <p className="text-sm">Total: <strong>Rp {order.total?.toLocaleString?.("id-ID") ?? order.total}</strong></p>
        <div className="mt-4">
          <h3 className="font-semibold">Item</h3>
          <ul className="mt-2 space-y-2">
            {order.items.map((it: any) => (
              <li key={it.productId} className="flex items-center justify-between">
                <div>
                  <p className="text-sm">{it.productId}</p>
                  <p className="text-xs text-slate-500">Qty: {it.quantity}</p>
                </div>
                <div className="text-sm">Rp {(it.price ?? 0).toLocaleString("id-ID")}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
