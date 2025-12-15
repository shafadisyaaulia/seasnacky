"use client";

import { useEffect, useRef } from "react";
import { notifyShopApproved, notifyShopRejected, requestNotificationPermission } from "@/lib/notifications";

export default function ShopStatusChecker() {
  const previousStatusRef = useRef<string | null>(null);
  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    // Request notification permission on mount
    requestNotificationPermission();

    const checkShopStatus = async () => {
      try {
        const res = await fetch("/api/shop/check-status");
        if (!res.ok) return;

        const data = await res.json();

        // If user doesn't have a shop, skip
        if (!data.hasShop) {
          previousStatusRef.current = null;
          hasNotifiedRef.current = false;
          return;
        }

        // Store initial status
        if (previousStatusRef.current === null) {
          previousStatusRef.current = data.shopStatus;
          return;
        }

        // Check if status changed and notify
        if (previousStatusRef.current !== data.shopStatus && !hasNotifiedRef.current) {
          if (data.shopStatus === "active" && previousStatusRef.current === "pending") {
            notifyShopApproved(data.shopName);
            hasNotifiedRef.current = true;
            
            // Refresh session to update JWT token with new role
            await fetch("/api/auth/refresh", { method: "POST" });
            
            // Reload page after refreshing session to update UI
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else if (data.shopStatus === "suspended" && previousStatusRef.current === "pending") {
            notifyShopRejected(data.shopName);
            hasNotifiedRef.current = true;
            
            // Refresh session to revert role back to buyer
            await fetch("/api/auth/refresh", { method: "POST" });
            
            // Reload page after refreshing session
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
          
          previousStatusRef.current = data.shopStatus;
        }
      } catch (error) {
        console.error("Error checking shop status:", error);
      }
    };

    // Initial check
    checkShopStatus();

    // Poll every 30 seconds
    const interval = setInterval(checkShopStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything
}
