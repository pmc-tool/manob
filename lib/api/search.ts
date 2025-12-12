// CONTRACT: Search API endpoints match PMC exactly
// MIGRATION: Centralized search API module

import { api } from './client';
import type { SearchRequest, SearchResponse } from './types';

/**
 * Search API module
 * CONTRACT: All endpoints and request/response shapes match PMC API
 */
export const searchApi = {
  /**
   * Search products, services, and jobs
   * CONTRACT: GET /search
   */
  search: (params: SearchRequest) => {
    const searchParams = new URLSearchParams();
    searchParams.set('query', params.query);
    if (params.type) searchParams.set('type', params.type);
    if (params.categoryId) searchParams.set('categoryId', params.categoryId);
    if (params.minPrice) searchParams.set('minPrice', String(params.minPrice));
    if (params.maxPrice) searchParams.set('maxPrice', String(params.maxPrice));
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    return api.get<SearchResponse>(`/search?${searchParams.toString()}`);
  },

  /**
   * Get search suggestions (autocomplete)
   * CONTRACT: GET /search/suggestions
   */
  getSuggestions: (query: string, limit = 5) =>
    api.get<{ suggestions: string[] }>(
      `/search/suggestions?query=${encodeURIComponent(query)}&limit=${limit}`
    ),

  /**
   * Get trending searches
   * CONTRACT: GET /search/trending
   */
  getTrending: (limit = 10) =>
    api.get<{ searches: string[] }>(`/search/trending?limit=${limit}`),

  /**
   * Get recent searches for user
   * CONTRACT: GET /search/recent
   */
  getRecentSearches: (limit = 10) =>
    api.get<{ searches: string[] }>(`/search/recent?limit=${limit}`),

  /**
   * Clear recent searches
   * CONTRACT: DELETE /search/recent
   */
  clearRecentSearches: () => api.delete<{ message: string }>('/search/recent'),
};

// Re-export types
export type { SearchRequest, SearchResponse };

export default searchApi;
