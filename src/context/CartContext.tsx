"use client";

import React, { createContext, useContext, useState } from "react";

type CartItem = { productId: string; quantity: number };

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  clear: () => void;
};

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  async function addItem(item: CartItem) {
    // call API
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "usr-001", productId: item.productId, quantity: item.quantity }),
    });
    setItems((s) => {
      const existing = s.find((it) => it.productId === item.productId);
      if (existing) {
        return s.map((it) => (it.productId === item.productId ? { ...it, quantity: it.quantity + item.quantity } : it));
      }
      return [...s, item];
    });
  }

  function clear() {
    setItems([]);
  }

  return <CartContext.Provider value={{ items, addItem, clear }}>{children}</CartContext.Provider>;
}
