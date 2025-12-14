// MIGRATION: ReviewStars component from manob.ai
// Uses lucide-react icons instead of react-bootstrap-icons
'use client';

import { Star, StarHalf } from 'lucide-react';
import styles from './ReviewStars.module.css';

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
  textSize = '',
  textColor = 'textMuted',
  ratingTextColor = 'darkColor',
  showCount = true,
}: ReviewStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`${styles.reviewMeta} ${className}`}>
      <div className={styles.ratingStars}>
        {/* Render full stars */}
        {Array.from({ length: fullStars }).map((_, index) => (
          <Star
            key={`full-${index}`}
            size={size}
            className={styles.starFilled}
            fill="currentColor"
          />
        ))}
        {/* Render half star if applicable */}
        {hasHalfStar && (
          <StarHalf size={size} className={styles.starFilled} fill="currentColor" />
        )}
        {/* Render empty stars */}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <Star key={`empty-${index}`} size={size} className={styles.starEmpty} />
        ))}
      </div>
      <div className={`${styles[textColor]} ${textSize}`}>
        {showCount && (
          <span className={`${styles.ratingValue} ${styles[ratingTextColor]}`}>
            ({rating})
          </span>
        )}
        {reviewCount !== undefined && (
          <span className={styles.reviewCount}>{reviewCount} Reviews</span>
        )}
      </div>
    </div>
  );
}
