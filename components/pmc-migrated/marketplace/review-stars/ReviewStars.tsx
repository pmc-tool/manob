// MIGRATION: ReviewStars component from manob.ai
// Uses lucide-react icons instead of react-bootstrap-icons
'use client';

import { Star, StarHalf } from 'lucide-react';

interface ReviewStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  className?: string;
  textSize?: string;
  textColor?: string;
  ratingTextColor?: string;
  showCount?: boolean;
}

export default function ReviewStars({
  rating,
  reviewCount,
  size = 14.5,
  className = '',
  showCount = true,
}: ReviewStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <div className="flex items-center gap-0.5">
        {/* Render full stars */}
        {Array.from({ length: fullStars }).map((_, index) => (
          <Star
            key={`full-${index}`}
            size={size}
            className="text-yellow-400"
            fill="currentColor"
          />
        ))}
        {/* Render half star if applicable */}
        {hasHalfStar && (
          <StarHalf size={size} className="text-yellow-400" fill="currentColor" />
        )}
        {/* Render empty stars */}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <Star key={`empty-${index}`} size={size} className="text-gray-300" />
        ))}
      </div>
      <div className="text-gray-500">
        {showCount && (
          <span className="font-semibold text-gray-900">({rating})</span>
        )}
        {reviewCount !== undefined && (
          <span className="ml-2">{reviewCount} Reviews</span>
        )}
      </div>
    </div>
  );
}
