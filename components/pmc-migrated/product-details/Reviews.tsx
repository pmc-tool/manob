// Reviews component for product details (matching original PMC design)
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Review, timeAgo } from '@/lib/mocks/product-details.mock';
import { PmcButton, SecondaryButton } from '@/components/ui/pmc-button';
import { PmcTextArea } from '@/components/ui/pmc-input';

interface RatingSequence {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

interface ReviewsProps {
  reviews: Review[];
  avgRating: number;
  totalReviews: number;
  ratingSequence: RatingSequence;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onFilterChange: (filter: string) => void;
  isOwner?: boolean;
  onReply?: (reviewId: string, content: string) => void;
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

function SingleReview({
  review,
  isOwner,
  onReply,
}: {
  review: Review;
  isOwner?: boolean;
  onReply?: (reviewId: string, content: string) => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitReply = () => {
    if (onReply && replyContent.trim()) {
      onReply(review.id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  return (
    // Original: bgc-gray-4 d-flex mb-3 p-3 p-sm-4 rounded-2
    <div className="bgc-gray-4 flex mb-3 p-3 sm:p-4 rounded-2">
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
        <div className="flex items-center gap-2 mb-1">
          <h4 className="fz16 font-semibold mb-0">- {review.user_name}</h4>
          <ReviewStars rating={review.rating} />
        </div>
        <p className="fz13 text-gray-500 mb-2">{timeAgo(review.created_at)}</p>
        <p className="text-gray-700 fs-15">{review.content}</p>

        {/* Author Reply */}
        {review.author_reply && (
          <div className="mt-3 pl-4 border-l-2 border-primary bg-red-50 p-3 rounded-r-md">
            <p className="text-sm font-medium text-primary mb-1">Author Response:</p>
            <p className="text-sm text-gray-700">{review.author_reply}</p>
          </div>
        )}

        {/* Reply Button for Owner */}
        {isOwner && !review.author_reply && (
          <div className="mt-3">
            {!showReplyForm ? (
              <button
                onClick={() => setShowReplyForm(true)}
                className="text-sm text-primary font-medium hover:underline"
              >
                Reply to this review
              </button>
            ) : (
              <div className="space-y-2">
                <PmcTextArea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  rows={3}
                />
                <div className="flex gap-2">
                  <PmcButton variant="primary" onClick={handleSubmitReply}>
                    Submit Reply
                  </PmcButton>
                  <SecondaryButton
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyContent('');
                    }}
                  >
                    Cancel
                  </SecondaryButton>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Reviews({
  reviews,
  avgRating,
  totalReviews,
  ratingSequence,
  currentPage,
  totalPages,
  onPageChange,
  onFilterChange,
  isOwner,
  onReply,
}: ReviewsProps) {
  return (
    <div className="mb-4">
      {/* Header - Original: row mb-4 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-grow">
          <h4 className="fz21 mb-0">
            <span className="fw-bold">{totalReviews}</span> Reviews.
          </h4>
        </div>
        <div className="shrink-0">
          <div className="flex items-center text-gray-900 gap-2 whitespace-nowrap">
            <span>Sort by</span>
            <select
              onChange={(e) => onFilterChange(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="newest">Newest</option>
              <option value="highest_rating">Highest Rating</option>
              <option value="lowest_rating">Lowest Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rating Summary */}
      <div className="mb-5 rounded-md p-3 sm:p-4 bgc-gray-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="text-center sm:w-auto">
            <h6 className="mb-4 text-sm">Average user rating</h6>
            <div className="rating-point relative mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={120}
                height={120}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth=".5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <h3 className="absolute inset-0 flex items-center justify-center mb-0 fz18 text-primary font-bold">
                {avgRating.toFixed(1)}
              </h3>
            </div>
            <span className="fz13">{totalReviews} Reviews</span>
          </div>
          <RatingBreakdown ratingSequence={ratingSequence} totalCount={totalReviews} />
        </div>
      </div>

      {/* Reviews List */}
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <SingleReview key={review.id} review={review} isOwner={isOwner} onReply={onReply} />
        ))
      ) : (
        <div className="text-center py-8">
          <Image
            src="/images/marketing-analysis.png"
            alt="No reviews"
            width={150}
            height={150}
            className="mx-auto mb-4"
            unoptimized
          />
          <div className="mt-3">
            <div className="font-semibold fz16">Review Not Available</div>
            <div className="fz14 text-gray-500">
              There are no reviews to display at the moment. Check back later
              <br className="hidden sm:block" />
              or be the first to leave a review!
            </div>
          </div>
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
