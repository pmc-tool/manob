// Comments component for product details (matching original PMC design)
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CornerDownRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Comment, timeAgo } from '@/lib/mocks/product-details.mock';

interface CommentsProps {
  comments: Comment[];
  totalComments: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onFilterChange: (filter: string) => void;
  onReply?: (commentId: string, content: string) => void;
  isOwner?: boolean;
}

function SingleComment({
  comment,
  isOwner,
  onReply,
}: {
  comment: Comment;
  isOwner?: boolean;
  onReply?: (commentId: string, content: string) => void;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitReply = () => {
    if (onReply && replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setReplyOpen(false);
    }
  };

  return (
    <div className="bgc-gray-6 border mb-3 rounded-md">
      <div className="flex p-3 sm:p-4">
        <div className="flex-shrink-0">
          <Image
            src={comment.user_avatar}
            alt={comment.user_name}
            width={50}
            height={50}
            className="rounded-full object-cover"
            unoptimized
          />
        </div>
        <div className="flex-grow ms-3">
          <div className="comment-header mb-2">
            <div className="flex items-center gap-2">
              <h4 className="fz16 mb-0 font-semibold">- {comment.user_name}</h4>
              <div className="flex gap-1">
                {/* Status badges can go here */}
              </div>
            </div>
            <div className="comment-datetime fz13 text-gray-500">{timeAgo(comment.created_at)}</div>
          </div>
          <div className="fs-15">{comment.content}</div>

          {/* Reply button for owner */}
          {isOwner && (
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => setReplyOpen(!replyOpen)}
                className="fz12 font-semibold tracking-wider uppercase reply-open border-0 bg-transparent hover:text-primary"
              >
                Reply
                <CornerDownRight className="h-4 w-4 inline ml-1" />
              </button>
            </div>
          )}

          {/* Existing replies */}
          {comment.replies?.map((reply) => (
            <div key={reply.id} className="flex mt-3 border-t pt-3">
              <div className="flex-shrink-0">
                <Image
                  src={reply.user_avatar}
                  alt={reply.user_name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-grow ms-3">
                <div className="comment-header mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="fz16 mb-0 font-semibold">- {reply.user_name}</h4>
                    <div className="flex gap-1">
                      {reply.is_author && (
                        <span className="status status-success bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
                          Author
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="comment-datetime fz13 text-gray-500">{timeAgo(reply.created_at)}</div>
                </div>
                <div className="fs-15">{reply.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reply Form */}
      {replyOpen && (
        <div className="reply-form p-3 sm:p-4 border-t">
          <div className="flex justify-between mb-2">
            <h4 className="fz16 mb-0 font-semibold">Reply to {comment.user_name}</h4>
            <button onClick={() => setReplyOpen(false)} className="reply-close-btn border-0 bg-transparent">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mb-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Leave a comment"
              className="form-control w-full p-3 border rounded-md"
              rows={4}
            />
          </div>
          <button onClick={handleSubmitReply} className="ud-btn btn-thm py-2 rounded-md">
            Reply
          </button>
        </div>
      )}
    </div>
  );
}

export default function Comments({
  comments,
  totalComments,
  currentPage,
  totalPages,
  onPageChange,
  onFilterChange,
  onReply,
  isOwner,
}: CommentsProps) {
  return (
    <div className="mb-4 mt-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h4 className="fz20 mb-0">
          <span className="font-bold">{totalComments}</span> comments found.
        </h4>
        <div className="flex items-center gap-2 text-nowrap">
          <span className="text-sm text-gray-700">Sort by</span>
          <select onChange={(e) => onFilterChange(e.target.value)} className="form-select form-select-sm">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Comments List */}
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <SingleComment key={comment.id} comment={comment} isOwner={isOwner} onReply={onReply} />
        ))
      ) : (
        <div className="text-center py-8">
          <Image
            src="/images/message.png"
            alt="No comments"
            width={150}
            height={150}
            className="mx-auto mb-4"
            unoptimized
          />
          <div className="mt-3">
            <div className="font-semibold fz16">Your kudos and feedback are welcome!</div>
            <div className="fz14 text-gray-500">Share your thoughts using the comment box under.</div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {comments && comments.length > 0 && totalPages > 1 && (
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
