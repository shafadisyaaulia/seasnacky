"use client";

import { useState, useEffect } from "react";
import RatingStars from "./RatingStars";
import { ThumbsUp, User, CheckCircle } from "lucide-react";

interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  helpful: number;
  verified: boolean;
  createdAt: string;
}

interface ReviewListProps {
  productId: string;
  refreshTrigger?: number;
}

export default function ReviewList({ productId, refreshTrigger }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  useEffect(() => {
    fetchReviews();
  }, [productId, refreshTrigger]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();

      if (data.reviews) {
        setReviews(data.reviews);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="flex flex-col items-center justify-center border-r-0 md:border-r border-gray-200">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            <RatingStars rating={stats.averageRating} size={24} showNumber={false} />
            <p className="text-sm text-gray-500 mt-2">
              {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution[star as keyof typeof stats.distribution] || 0;
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 w-8">
                    {star} ⭐
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-yellow-400 h-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Belum ada review untuk produk ini</p>
          <p className="text-sm text-gray-400 mt-1">Jadilah yang pertama memberikan review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-200 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">
                        {review.userName}
                      </p>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          <CheckCircle size={12} />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <RatingStars rating={review.rating} size={16} showNumber={false} />
              </div>

              {/* Comment */}
              <p className="text-gray-700 leading-relaxed mb-4">
                {review.comment}
              </p>

              {/* Footer */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <ThumbsUp size={16} />
                  <span>Membantu ({review.helpful})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
