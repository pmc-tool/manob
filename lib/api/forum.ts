// CONTRACT: Forum API endpoints
// All endpoints match the actual backend API

import { api } from './client';
import type {
  Forum,
  ForumListResponse,
  ForumDetailResponse,
  ForumCommentsResponse,
  TopContributorsResponse,
  TopForumsResponse,
  ForumCreateRequest,
  ForumUpdateRequest,
  ForumCommentCreateRequest,
  ForumInteractionRequest,
  ForumListParams,
  ForumComment,
  SuccessResponse,
} from './types';

/**
 * Build query string from params
 */
function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

/**
 * Forum API module
 */
export const forumApi = {
  // ============================================
  // Public Endpoints (No Auth Required)
  // ============================================

  /**
   * Get all forums (public)
   * GET /public/forum
   * @param params - Query params: page, limit, sort_by, term, filter
   */
  getForums: (params?: ForumListParams) => {
    const query = buildQueryString((params || {}) as Record<string, unknown>);
    return api.get<ForumListResponse>(`/public/forum${query}`, { skipAuth: true });
  },

  /**
   * Get single forum (public)
   * GET /public/forum/:id
   */
  getForum: (id: string) => {
    return api.get<ForumDetailResponse>(`/public/forum/${id}`, { skipAuth: true });
  },

  /**
   * Get forum comments (public)
   * GET /public/forum/:id/comments
   * @param sortBy - Sort option
   */
  getForumComments: (id: string, sortBy?: string) => {
    const query = sortBy ? `?sort_by=${sortBy}` : '';
    return api.get<ForumCommentsResponse>(`/public/forum/${id}/comments${query}`, { skipAuth: true });
  },

  /**
   * Increment view count
   * PATCH /public/forum/:id/view
   */
  incrementViewCount: (id: string) => {
    return api.patch<SuccessResponse>(`/public/forum/${id}/view`, undefined, { skipAuth: true });
  },

  /**
   * Get top contributors
   * GET /public/top-forum-contributors
   */
  getTopContributors: () => {
    return api.get<TopContributorsResponse>('/public/top-forum-contributors', { skipAuth: true });
  },

  /**
   * Get top forums
   * GET /public/top-forums
   */
  getTopForums: () => {
    return api.get<TopForumsResponse>('/public/top-forums', { skipAuth: true });
  },

  // ============================================
  // Private Endpoints (Auth Required)
  // ============================================

  /**
   * Create forum
   * POST /forum
   */
  createForum: (data: ForumCreateRequest) => {
    return api.post<ForumDetailResponse>('/forum', data);
  },

  /**
   * Update forum
   * PATCH /forum/:id
   */
  updateForum: (id: string, data: ForumUpdateRequest) => {
    return api.patch<ForumDetailResponse>(`/forum/${id}`, data);
  },

  /**
   * Mark forum as solved
   * PATCH /forum/:id/solved
   */
  markAsSolved: (id: string, commentId: string) => {
    return api.patch<SuccessResponse>(`/forum/${id}/solved`, { comment_id: commentId });
  },

  /**
   * Request pin for forum
   * PATCH /forum/:id/pin-request
   */
  requestPin: (id: string) => {
    return api.patch<SuccessResponse>(`/forum/${id}/pin-request`);
  },

  /**
   * Update forum interaction (like/unlike/bookmark)
   * PATCH /forum/:id/interaction
   */
  updateInteraction: (id: string, data: ForumInteractionRequest) => {
    return api.patch<SuccessResponse>(`/forum/${id}/interaction`, data);
  },

  /**
   * Like a forum
   */
  likeForum: (id: string) => {
    return forumApi.updateInteraction(id, { type: 'like' });
  },

  /**
   * Unlike a forum
   */
  unlikeForum: (id: string) => {
    return forumApi.updateInteraction(id, { type: 'unlike' });
  },

  /**
   * Bookmark a forum
   */
  bookmarkForum: (id: string) => {
    return forumApi.updateInteraction(id, { type: 'bookmark' });
  },

  /**
   * Remove bookmark from forum
   */
  unbookmarkForum: (id: string) => {
    return forumApi.updateInteraction(id, { type: 'unbookmark' });
  },

  /**
   * Create forum comment
   * POST /forum/:id/comment
   */
  createComment: (forumId: string, data: ForumCommentCreateRequest) => {
    return api.post<ForumComment>(`/forum/${forumId}/comment`, data);
  },

  /**
   * Get my forums
   * GET /forum
   */
  getMyForums: (params?: { page?: number; limit?: number }) => {
    const query = buildQueryString((params || {}) as Record<string, unknown>);
    return api.get<ForumListResponse>(`/forum${query}`);
  },

  /**
   * Get my bookmarked forums
   * GET /forum-bookmark
   */
  getBookmarkedForums: (params?: { page?: number; limit?: number }) => {
    const query = buildQueryString((params || {}) as Record<string, unknown>);
    return api.get<ForumListResponse>(`/forum-bookmark${query}`);
  },

  /**
   * Get my single forum (with edit permissions check)
   * GET /forum/:id
   */
  getMyForum: (id: string) => {
    return api.get<ForumDetailResponse>(`/forum/${id}`);
  },
};

export default forumApi;
