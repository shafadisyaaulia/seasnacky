"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type CartItem = { productId: string; quantity: number };

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  updateItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

const STORAGE_KEY = "ss:cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as CartItem[];
      }
    } catch (e) {
      // ignore parse errors
    }
    return [];
  });

  // persist to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  }, [items]);

  // sync across tabs
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) {
        try {
          const newItems = e.newValue ? (JSON.parse(e.newValue) as CartItem[]) : [];
          setItems(newItems);
        } catch (err) {
          // ignore
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  async function addItem(item: CartItem) {
    // attempt to call API but don't block state update on failure
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "usr-001", productId: item.productId, quantity: item.quantity }),
      });
    } catch (err) {
      // ignore network errors for now (we still keep client-side cart)
    }

    setItems((s) => {
      const existing = s.find((it) => it.productId === item.productId);
      if (existing) {
        return s.map((it) => (it.productId === item.productId ? { ...it, quantity: it.quantity + item.quantity } : it));
      }
      return [...s, item];
    });
  }

  function updateItem(productId: string, quantity: number) {
    setItems((s) => s.map((it) => (it.productId === productId ? { ...it, quantity } : it)).filter((it) => it.quantity > 0));
  }

  function removeItem(productId: string) {
    setItems((s) => s.filter((it) => it.productId !== productId));
  }

  function clear() {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }

  return <CartContext.Provider value={{ items, addItem, updateItem, removeItem, clear }}>{children}</CartContext.Provider>;
}
