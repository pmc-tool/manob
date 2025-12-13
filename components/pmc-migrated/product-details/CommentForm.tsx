// Comment Form component
'use client';

import { useState } from 'react';

interface CommentFormProps {
  productId: string;
  onSubmit: (comment: string) => void;
}

export default function CommentForm({ productId, onSubmit }: CommentFormProps) {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (comment.trim().length < 10) {
      setError('Please enter at least 10 characters');
      return;
    }

    if (comment.trim().length > 5000) {
      setError('Comment cannot exceed 5000 characters');
      return;
    }

    setError('');
    onSubmit(comment);
    setComment('');
  };

  return (
    <div className="mt-8 mb-4">
      <h4 className="text-lg font-semibold mb-4">Leave a Comment</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment <span className="text-red-500">*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts or ask a question..."
            rows={5}
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <p className="text-sm text-gray-500 mt-1">{comment.length}/5000 characters</p>
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors"
        >
          Leave a comment
        </button>
      </form>
    </div>
  );
}
