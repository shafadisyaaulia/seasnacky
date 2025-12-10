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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Get or create userId
  useEffect(() => {
    async function initUser() {
      try {
        // Try to get logged in user first
        const meRes = await fetch("/api/me");
        if (meRes.ok) {
          const response = await meRes.json();
          if (response.data && response.data.id) {
            console.log("👤 Logged in user:", response.data.id);
            setUserId(response.data.id);
            return;
          }
        }
      } catch (e) {
        console.log("👤 Not logged in, using guest");
      }
      
      // Use or create guest ID
      let guestId;
      try {
        guestId = localStorage.getItem("ss:guestId");
      } catch (e) {
        console.warn("⚠️ localStorage blocked, using session-only guest ID");
      }
      
      if (!guestId) {
        guestId = `guest-${Date.now()}`;
        try {
          localStorage.setItem("ss:guestId", guestId);
        } catch (e) {
          console.warn("⚠️ Cannot save guest ID to localStorage");
        }
      }
      console.log("👤 Using guest ID:", guestId);
      setUserId(guestId);
    }
    initUser();
  }, []);

  // Load cart from MongoDB when userId is ready
  useEffect(() => {
    if (!userId) return;
    
    console.log("🔄 Loading cart for userId:", userId);
    
    async function loadCart() {
      try {
        const res = await fetch(`/api/cart?userId=${userId}`);
        console.log("📦 Cart API response status:", res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log("📦 Cart API response data:", data);
          const cartItems = Array.isArray(data.data) ? data.data : [];
          console.log("📦 Loaded cart from MongoDB:", cartItems);
          setItems(cartItems);
        } else {
          console.error("❌ Cart API error:", res.status, res.statusText);
        }
      } catch (err) {
        console.error("❌ Failed to load cart:", err);
      } finally {
        setLoaded(true);
      }
    }
    loadCart();
  }, [userId]);

  async function addItem(item: CartItem) {
    console.log("🛒 addItem called with:", item, "userId:", userId);
    
    if (!userId) {
      console.error("❌ No userId available");
      throw new Error("User ID tidak tersedia");
    }

    try {
      console.log("📤 Sending POST to /api/cart");
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId, 
          productId: item.productId, 
          quantity: item.quantity 
        }),
      });
      
      console.log("📥 POST /api/cart response status:", res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ POST /api/cart error:", errorData);
        throw new Error(errorData.message || "Gagal menambahkan ke keranjang");
      }
      
      const responseData = await res.json();
      console.log("✅ Successfully added to MongoDB:", responseData);
      
      // Reload cart from server to get updated data
      console.log("🔄 Reloading cart from server...");
      const cartRes = await fetch(`/api/cart?userId=${userId}`);
      console.log("📥 GET /api/cart response status:", cartRes.status);
      
      if (cartRes.ok) {
        const data = await cartRes.json();
        console.log("📦 Cart reload data:", data);
        const cartItems = Array.isArray(data.data) ? data.data : [];
        setItems(cartItems);
        console.log("✅ Cart reloaded with", cartItems.length, "items:", cartItems);
      }
    } catch (err) {
      console.error("❌ Failed to add item:", err);
      throw err;
    }
  }

  function updateItem(productId: string, quantity: number) {
    if (!userId) return;
    
    if (quantity === 0) {
      removeItem(productId);
      return;
    }
    
    // Update locally first
    setItems((s) => s.map((it) => (it.productId === productId ? { ...it, quantity } : it)));
    
    // Sync with server
    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, quantity })
    }).catch(console.error);
  }

  function removeItem(productId: string) {
    if (!userId) return;
    
    // Update locally first
    setItems((s) => s.filter((it) => it.productId !== productId));
    
    // Sync with server
    fetch(`/api/cart?userId=${userId}&productId=${productId}`, {
      method: "DELETE"
    }).catch(console.error);
  }

  function clear() {
    if (!userId) return;
    
    setItems([]);
    
    // Clear on server
    fetch(`/api/cart?userId=${userId}`, {
      method: "DELETE"
    }).catch(console.error);
  }

  return <CartContext.Provider value={{ items, addItem, updateItem, removeItem, clear }}>{children}</CartContext.Provider>;
}
