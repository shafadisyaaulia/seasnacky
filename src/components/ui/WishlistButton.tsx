"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useNotification } from "@/context/NotificationContext";

interface WishlistButtonProps {
  productId: string;
  productName?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function WishlistButton({
  productId,
  productName,
  size = "md",
  showText = false,
}: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { showNotification } = useNotification();

  // Check if product is in wishlist on mount
  useEffect(() => {
    checkWishlistStatus();
  }, [productId]);

  const checkWishlistStatus = async () => {
    try {
      const res = await fetch(`/api/wishlist/check?productId=${productId}`);
      const data = await res.json();
      setInWishlist(data.inWishlist);
    } catch (error) {
      console.error("Error checking wishlist:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);

    try {
      if (inWishlist) {
        // Remove from wishlist
        const res = await fetch(`/api/wishlist?productId=${productId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message);
        }

        setInWishlist(false);
        showNotification(
          "Dihapus dari Wishlist",
          productName || "Produk berhasil dihapus dari favorit"
        );
      } else {
        // Add to wishlist
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message);
        }

        setInWishlist(true);
        showNotification(
          "Ditambahkan ke Wishlist! ❤️",
          productName || "Produk berhasil ditambahkan ke favorit"
        );
      }
    } catch (error: any) {
      showNotification("Gagal", error.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  if (isChecking) {
    return (
      <button
        disabled
        className={`${sizeClasses[size]} rounded-full bg-gray-100 flex items-center justify-center`}
      >
        <Heart size={iconSizes[size]} className="text-gray-300" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`${
        showText ? "px-4 py-2 gap-2" : sizeClasses[size]
      } rounded-full flex items-center justify-center transition-all ${
        inWishlist
          ? "bg-red-100 hover:bg-red-200 text-red-600"
          : "bg-white hover:bg-gray-100 text-gray-600 border border-gray-200"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={inWishlist ? "Hapus dari wishlist" : "Tambah ke wishlist"}
    >
      <Heart
        size={iconSizes[size]}
        className={`${
          inWishlist ? "fill-current" : ""
        } transition-transform ${isLoading ? "scale-75" : "scale-100"}`}
      />
      {showText && (
        <span className="font-medium text-sm">
          {inWishlist ? "Favorit" : "Wishlist"}
        </span>
      )}
    </button>
  );
}
