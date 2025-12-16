// Service Reviews component (matching original PMC design)
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { ServiceReview, timeAgo } from '@/lib/mocks/service-details.mock';

interface RatingSequence {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

interface ServiceReviewsProps {
  reviews: ServiceReview[];
  avgRating: number;
  totalReviews: number;
  ratingSequence: RatingSequence;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onFilterChange: (filter: string) => void;
}

function ReviewStars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

function RatingBreakdown({
  ratingSequence,
  totalCount,
}: {
  ratingSequence: RatingSequence;
  totalCount: number;
}) {
  return (
    <div className="flex-grow">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = ratingSequence[rating as keyof RatingSequence] || 0;
        const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
        return (
          <div key={rating} className="flex items-center gap-2 mb-1">
            <span className="text-sm w-3">{rating}</span>
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }} />
            </div>
            <span className="text-sm text-gray-500 w-8">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

function SingleReview({ review }: { review: ServiceReview }) {
  return (
    <div className="bgc-gray-4 flex mb-3 p-3 sm:p-4 rounded-lg">
      <div className="flex-shrink-0">
        <Image
          src={review.user_avatar}
          alt={review.user_name}
          width={50}
          height={50}
          className="rounded-full object-cover"
          unoptimized
        />
      </div>
      <div className="flex-grow ms-3">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h4 className="fz16 font-semibold mb-0">{review.user_name}</h4>
          <ReviewStars rating={review.rating} />
          {review.country && (
            <span className="flex items-center gap-1 text-gray-500 text-sm">
              <MapPin className="h-3 w-3" />
              {review.country}
            </span>
          )}
        </div>
        <p className="fz13 text-gray-500 mb-2">{timeAgo(review.created_at)}</p>
        <p className="text-gray-700 fz14">{review.content}</p>

        {/* Seller Reply */}
        {review.seller_reply && (
          <div className="mt-3 pl-4 border-l-2 border-primary bg-red-50 p-3 rounded-r-md">
            <p className="text-sm font-medium text-primary mb-1">Seller&apos;s Response:</p>
            <p className="text-sm text-gray-700">{review.seller_reply}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServiceReviews({
  reviews,
  avgRating,
  totalReviews,
  ratingSequence,
  currentPage,
  totalPages,
  onPageChange,
  onFilterChange,
}: ServiceReviewsProps) {
  return (
    <div className="service-reviews mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">
          Reviews <span className="text-gray-500 font-normal">({totalReviews})</span>
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by</span>
          <select
            onChange={(e) => onFilterChange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="newest">Most Recent</option>
            <option value="highest_rating">Highest Rating</option>
            <option value="lowest_rating">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Rating Summary */}
      <div className="mb-5 rounded-lg p-4 bgc-gray-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="text-center sm:w-40">
            <div className="text-5xl font-bold text-gray-800 mb-1">{avgRating.toFixed(1)}</div>
            <ReviewStars rating={Math.round(avgRating)} size={20} />
            <p className="text-gray-500 fz13 mt-2">{totalReviews} Reviews</p>
          </div>
          <RatingBreakdown ratingSequence={ratingSequence} totalCount={totalReviews} />
        </div>
      </div>

      {/* Reviews List */}
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => <SingleReview key={review.id} review={review} />)
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Star className="h-12 w-12 mx-auto" />
          </div>
          <div className="font-semibold fz16">No Reviews Yet</div>
          <div className="fz14 text-gray-500">Be the first to leave a review!</div>
        </div>
      )}

      {/* Pagination */}
      {reviews && reviews.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md ${
                currentPage === page ? 'bg-primary text-white' : 'border hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
