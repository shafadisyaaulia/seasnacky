"use client";

import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: number;
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function RatingStars({
  rating,
  size = 20,
  showNumber = true,
  interactive = false,
  onRatingChange,
}: RatingStarsProps) {
  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => {
        const isFilled = value <= rating;
        const isHalfFilled = value === Math.ceil(rating) && rating % 1 !== 0;

        return (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            {isHalfFilled ? (
              <div className="relative" style={{ width: size, height: size }}>
                <Star
                  size={size}
                  className="absolute text-gray-300"
                  fill="currentColor"
                />
                <div className="absolute overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
                  <Star
                    size={size}
                    className="text-yellow-400"
                    fill="currentColor"
                  />
                </div>
              </div>
            ) : (
              <Star
                size={size}
                className={isFilled ? "text-yellow-400" : "text-gray-300"}
                fill="currentColor"
              />
            )}
          </button>
        );
      })}
      {showNumber && (
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
