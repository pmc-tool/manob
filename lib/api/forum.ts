// CONTRACT: Forum API endpoints match PMC exactly
// MIGRATION: Centralized forum API module

import { api } from './client';
import type {
  ForumTopic,
  ForumTopicListResponse,
  ForumPost,
  ForumPostListResponse,
  ForumPostCreateRequest,
  ForumReply,
  ForumReplyListResponse,
  Discussion,
  DiscussionListResponse,
  PaginationRequest,
  SuccessResponse,
} from './types';

/**
 * Forum API module
 * CONTRACT: All endpoints and request/response shapes match PMC API
 */
export const forumApi = {
  // ============================================
  // Topic Endpoints
  // ============================================

  /**
   * Get all forum topics
   * CONTRACT: GET /forum/topics
   */
  getTopics: () => api.get<ForumTopicListResponse>('/forum/topics'),

  /**
   * Get topic by slug
   * CONTRACT: GET /forum/topics/:slug
   */
  getTopic: (slug: string) => api.get<ForumTopic>(`/forum/topics/${slug}`),

  // ============================================
  // Post Endpoints
  // ============================================

  /**
   * Get posts in a topic
   * CONTRACT: GET /forum/topics/:topicId/posts
   */
  getPosts: (topicId: string, params?: PaginationRequest) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const query = searchParams.toString();
    return api.get<ForumPostListResponse>(
      `/forum/topics/${topicId}/posts${query ? `?${query}` : ''}`
    );
  },

  /**
   * Get single post
   * CONTRACT: GET /forum/posts/:id
   */
  getPost: (id: string) => api.get<ForumPost>(`/forum/posts/${id}`),

  /**
   * Create new post
   * CONTRACT: POST /forum/posts
   */
  createPost: (data: ForumPostCreateRequest) =>
    api.post<ForumPost>('/forum/posts', data),

  /**
   * Update post
   * CONTRACT: PUT /forum/posts/:id
   */
  updatePost: (id: string, data: { title?: string; content?: string }) =>
    api.put<ForumPost>(`/forum/posts/${id}`, data),

  /**
   * Delete post
   * CONTRACT: DELETE /forum/posts/:id
   */
  deletePost: (id: string) => api.delete<SuccessResponse>(`/forum/posts/${id}`),

  // ============================================
  // Reply Endpoints
  // ============================================

  /**
   * Get replies to a post
   * CONTRACT: GET /forum/posts/:postId/replies
   */
  getReplies: (postId: string, params?: PaginationRequest) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const query = searchParams.toString();
    return api.get<ForumReplyListResponse>(
      `/forum/posts/${postId}/replies${query ? `?${query}` : ''}`
    );
  },

  /**
   * Create reply
   * CONTRACT: POST /forum/posts/:postId/replies
   */
  createReply: (postId: string, content: string) =>
    api.post<ForumReply>(`/forum/posts/${postId}/replies`, { content }),

  /**
   * Delete reply
   * CONTRACT: DELETE /forum/replies/:id
   */
  deleteReply: (id: string) => api.delete<SuccessResponse>(`/forum/replies/${id}`),

  // ============================================
  // Discussion Endpoints
  // ============================================

  /**
   * Get discussions
   * CONTRACT: GET /discussions
   */
  getDiscussions: (params?: PaginationRequest & { category?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.category) searchParams.set('category', params.category);
    const query = searchParams.toString();
    return api.get<DiscussionListResponse>(`/discussions${query ? `?${query}` : ''}`);
  },

  /**
   * Get discussion by ID
   * CONTRACT: GET /discussions/:id
   */
  getDiscussion: (id: string) => api.get<Discussion>(`/discussions/${id}`),

  /**
   * Create discussion
   * CONTRACT: POST /discussions
   */
  createDiscussion: (data: { title: string; content: string; category: string; tags?: string[] }) =>
    api.post<Discussion>('/discussions', data),
};

export default forumApi;
