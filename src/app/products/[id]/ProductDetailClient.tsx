"use client";

import { useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import ReviewForm from "@/components/ui/ReviewForm";
import ReviewList from "@/components/ui/ReviewList";
import { MessageCircle, Edit3 } from "lucide-react";

interface ProductDetailClientProps {
  productId: string;
  productName: string;
}

export default function ProductDetailClient({
  productId,
  productName,
}: ProductDetailClientProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="mt-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 sm:p-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Review & Rating
            </h2>
          </div>
          {!showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Edit3 size={18} />
              Tulis Review
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="mb-8">
            <ReviewForm
              productId={productId}
              productName={productName}
              onSuccess={handleReviewSuccess}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        )}

        {/* Review List */}
        <ReviewList productId={productId} refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}
