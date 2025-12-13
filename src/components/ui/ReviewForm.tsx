"use client";

import { useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import RatingStars from "./RatingStars";
import { Send, X } from "lucide-react";

interface ReviewFormProps {
  productId: string;
  productName?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  productId,
  productName,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      showNotification("Rating Diperlukan", "Silakan pilih rating bintang");
      return;
    }

    if (comment.trim().length < 10) {
      showNotification("Review Terlalu Singkat", "Minimal 10 karakter untuk review");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          comment: comment.trim(),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Gagal mengirim review");
      }

      showNotification(
        "Review Berhasil Dikirim!",
        "Terima kasih atas review Anda ⭐",
        undefined
      );

      // Reset form
      setRating(0);
      setComment("");

      if (onSuccess) onSuccess();
    } catch (error: any) {
      showNotification("Gagal Mengirim Review", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Tulis Review</h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {productName && (
        <p className="text-sm text-gray-600 mb-4">
          Review untuk: <span className="font-medium">{productName}</span>
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <RatingStars
            rating={rating}
            size={32}
            showNumber={false}
            interactive
            onRatingChange={setRating}
          />
          {rating > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Anda memberikan {rating} bintang
            </p>
          )}
        </div>

        {/* Comment Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Anda <span className="text-red-500">*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Ceritakan pengalaman Anda dengan produk ini..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">
              Minimal 10 karakter
            </p>
            <p className="text-xs text-gray-500">
              {comment.length}/1000
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            {isSubmitting ? "Mengirim..." : "Kirim Review"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
