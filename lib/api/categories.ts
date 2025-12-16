// CONTRACT: Categories API endpoints match PMC exactly
// MIGRATION: Centralized categories API module

import { API_URL_INV } from './client';
import type { Category, CategoryListResponse } from './types';

// Helper for inventory API calls
const invApi = {
  get: <T>(endpoint: string) => {
    const url = `${API_URL_INV}${endpoint}`;
    return fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then(async (res) => {
      if (!res.ok) throw await res.json();
      return res.json() as Promise<T>;
    });
  },
};

/**
 * Categories API module
 * CONTRACT: All endpoints and request/response shapes match PMC API
 */
export const categoriesApi = {
  /**
   * Get all categories (flat list)
   * CONTRACT: GET /categories
   */
  getCategories: () => invApi.get<CategoryListResponse>('/categories'),

  /**
   * Get category by slug
   * CONTRACT: GET /categories/:slug
   */
  getCategory: (slug: string) => invApi.get<Category>(`/categories/${slug}`),

  /**
   * Get category tree (nested structure)
   * CONTRACT: GET /categories/tree
   */
  getCategoryTree: () => invApi.get<CategoryListResponse>('/categories/tree'),

  /**
   * Get child categories
   * CONTRACT: GET /categories/:id/children
   */
  getChildCategories: (parentId: string) =>
    invApi.get<CategoryListResponse>(`/categories/${parentId}/children`),

  /**
   * Get popular categories
   * CONTRACT: GET /categories/popular
   */
  getPopularCategories: (limit = 10) =>
    invApi.get<CategoryListResponse>(`/categories/popular?limit=${limit}`),
};

// Re-export types
export type { Category, CategoryListResponse };

export default categoriesApi;
