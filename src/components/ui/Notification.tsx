"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, X, ShoppingCart } from "lucide-react";

interface NotificationProps {
  show: boolean;
  title: string;
  message: string;
  productImage?: string;
  onClose: () => void;
  duration?: number;
}

export default function Notification({
  show,
  title,
  message,
  productImage,
  onClose,
  duration = 3000,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to finish
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show && !isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden max-w-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <div className="bg-white/20 p-1 rounded">
              <ShoppingCart size={18} />
            </div>
            <span className="font-bold text-sm">SeaSnacky</span>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="bg-green-100 rounded-full p-2">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-600">{message}</p>
            </div>
            {productImage && (
              <div className="flex-shrink-0">
                <img
                  src={productImage}
                  alt="Product"
                  className="w-12 h-12 object-cover rounded border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{
              width: isVisible ? "0%" : "100%",
              transition: `width ${duration}ms linear`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
