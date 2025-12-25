"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  Select,
  Empty,
  Skeleton,
  Button,
  Pagination,
  Rate,
  Progress,
  Input,
  message,
} from "antd";
import { Star, MessageSquare, Send, Filter } from "lucide-react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import {
  useGetUserReviewsQuery,
  useCreateUserReviewReplyMutation,
} from "@/state/services/reviews/reviews.service";

const { TextArea } = Input;

// Mock data for development
const mockReviewsData = {
  items: [
    {
      id: "1",
      rating: 5,
      content:
        "Excellent work! The seller delivered exactly what I needed and was very responsive throughout the project.",
      created_at: "2024-12-15T10:30:00Z",
      reviewer_meta: {
        name: "John Smith",
        avatar: null,
      },
      reply: null,
    },
    {
      id: "2",
      rating: 4,
      content:
        "Great quality product. Minor revision was needed but the seller handled it professionally.",
      created_at: "2024-12-14T14:20:00Z",
      reviewer_meta: {
        name: "Sarah Johnson",
        avatar: null,
      },
      reply: {
        content: "Thank you for your feedback! Happy to help.",
        created_at: "2024-12-14T16:00:00Z",
      },
    },
    {
      id: "3",
      rating: 5,
      content:
        "Outstanding service! Will definitely order again. Highly recommended.",
      created_at: "2024-12-13T09:15:00Z",
      reviewer_meta: {
        name: "Mike Brown",
        avatar: null,
      },
      reply: null,
    },
    {
      id: "4",
      rating: 3,
      content: "Good work overall but took a bit longer than expected.",
      created_at: "2024-12-12T16:45:00Z",
      reviewer_meta: {
        name: "Emma Wilson",
        avatar: null,
      },
      reply: null,
    },
  ],
  paginations: {
    total_count: 24,
    current_page: 1,
    total_pages: 3,
  },
  rating_summary: {
    avg_rating: 4.5,
    rating_count: {
      "5": 15,
      "4": 6,
      "3": 2,
      "2": 1,
      "1": 0,
    },
  },
};

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest", label: "Highest Rating" },
  { value: "lowest", label: "Lowest Rating" },
];

interface ReviewItem {
  id: string;
  rating: number;
  content: string;
  created_at: string;
  reviewer_meta?: {
    name: string;
    avatar: string | null;
  };
  reply?: {
    content: string;
    created_at: string;
  } | null;
}

interface RatingCount {
  [key: string]: number;
}

export default function SellerReviewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const userInfo = useSelector((state: any) => state.auth?.userInfo);

  // Fetch reviews
  const { data: reviewsData, isLoading, refetch } = useGetUserReviewsQuery(
    {
      id: userInfo?.id,
      page: currentPage,
      limit: "10",
      order: sortBy,
    },
    {
      skip: !userInfo?.id,
    }
  );

  // Reply mutation
  const [submitReply, { isLoading: isSubmitting, data: replyResponse }] =
    useCreateUserReviewReplyMutation();

  // Handle reply response
  useEffect(() => {
    if (replyResponse?.statusCode === 200 || replyResponse?.statusCode === 201) {
      message.success("Reply submitted successfully");
      setReplyingTo(null);
      setReplyContent("");
      refetch();
    } else if (replyResponse?.statusCode >= 400) {
      message.error(replyResponse?.message || "Failed to submit reply");
    }
  }, [replyResponse, refetch]);

  // Use mock data if API returns no data
  const reviews = reviewsData || mockReviewsData;
  const reviewItems: ReviewItem[] = reviews?.items || [];
  const pagination = reviews?.paginations;
  const ratingSummary = reviews?.rating_summary;
  const avgRating = ratingSummary?.avg_rating || 0;
  const ratingCount: RatingCount = ratingSummary?.rating_count || {};

  // Calculate total reviews
  const totalReviews = Object.values(ratingCount).reduce(
    (sum: number, count: number) => sum + count,
    0
  );

  const handleSubmitReply = async (reviewId: string) => {
    if (!replyContent.trim()) {
      message.warning("Please enter a reply");
      return;
    }
    await submitReply({ reviewId, reply: replyContent });
  };

  // Rating Bar Component
  const RatingBar = ({ stars, count }: { stars: number; count: number }) => {
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="w-12 text-gray-600">{stars} star</span>
        <Progress
          percent={percentage}
          showInfo={false}
          strokeColor="#facc15"
          trailColor="#f3f4f6"
          className="flex-1"
        />
        <span className="w-8 text-gray-500 text-right">{count}</span>
      </div>
    );
  };

  // Review Card Component
  const ReviewCard = ({ review }: { review: ReviewItem }) => (
    <div className="border-b border-gray-100 last:border-0 py-5 first:pt-0">
      <div className="flex items-start gap-4">
        <Image
          src={
            review.reviewer_meta?.avatar
              ? `${process.env.NEXT_PUBLIC_S3BUCKET}/${review.reviewer_meta.avatar}`
              : "/images/user-placeholder.jpg"
          }
          alt={review.reviewer_meta?.name || "Reviewer"}
          width={48}
          height={48}
          className="rounded-full object-cover"
          unoptimized
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-medium text-gray-900">
              {review.reviewer_meta?.name || "Anonymous"}
            </h4>
            <span className="text-sm text-gray-400">
              {dayjs(review.created_at).format("MMM DD, YYYY")}
            </span>
          </div>
          <Rate disabled value={review.rating} className="text-sm mb-2" />
          <p className="text-gray-600 mb-3">{review.content}</p>

          {/* Reply Section */}
          {review.reply ? (
            <div className="bg-gray-50 rounded-lg p-4 mt-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-900">
                  Your Reply
                </span>
                <span className="text-xs text-gray-400">
                  {dayjs(review.reply.created_at).format("MMM DD, YYYY")}
                </span>
              </div>
              <p className="text-sm text-gray-600">{review.reply.content}</p>
            </div>
          ) : replyingTo === review.id ? (
            <div className="mt-3">
              <TextArea
                placeholder="Write your reply..."
                rows={3}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button
                  type="primary"
                  icon={<Send size={14} />}
                  loading={isSubmitting}
                  onClick={() => handleSubmitReply(review.id)}
                >
                  Send Reply
                </Button>
                <Button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="text"
              size="small"
              icon={<MessageSquare size={14} />}
              onClick={() => setReplyingTo(review.id)}
              className="text-primary"
            >
              Reply
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
            <Star size={24} className="text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
            <p className="text-gray-500 text-sm">
              Manage and respond to customer feedback
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rating Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {avgRating.toFixed(1)}
                </div>
                <Rate disabled value={avgRating} allowHalf className="mb-2" />
                <p className="text-sm text-gray-500">
                  Based on {totalReviews} reviews
                </p>
              </div>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <RatingBar
                    key={stars}
                    stars={stars}
                    count={ratingCount[stars.toString()] || 0}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            {/* Filter Bar */}
            <Card className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Filter size={16} />
                  <span>Sort by:</span>
                </div>
                <Select
                  value={sortBy}
                  onChange={(value) => {
                    setSortBy(value);
                    setCurrentPage(1);
                  }}
                  options={sortOptions}
                  style={{ width: 160 }}
                />
              </div>
            </Card>

            {/* Reviews */}
            <Card>
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton.Avatar active size={48} />
                      <div className="flex-1">
                        <Skeleton active paragraph={{ rows: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : reviewItems.length > 0 ? (
                <>
                  <div className="divide-y divide-gray-100">
                    {reviewItems.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                  {pagination && pagination.total_pages > 1 && (
                    <div className="flex justify-center mt-6 pt-4 border-t border-gray-100">
                      <Pagination
                        current={currentPage}
                        total={pagination.total_count}
                        pageSize={10}
                        onChange={setCurrentPage}
                        showSizeChanger={false}
                      />
                    </div>
                  )}
                </>
              ) : (
                <Empty
                  image={
                    <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                      <Star size={40} className="text-gray-400" />
                    </div>
                  }
                  description={
                    <div className="mt-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        No Reviews Yet
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        You haven't received any reviews yet. Keep delivering
                        great work and reviews will follow!
                      </p>
                    </div>
                  }
                />
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
