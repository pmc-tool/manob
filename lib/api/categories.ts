// CONTRACT: Categories API endpoints match PMC exactly
// MIGRATION: Centralized categories API module

import { api } from './client';
import type { Category, CategoryListResponse } from './types';

/**
 * Categories API module
 * CONTRACT: All endpoints and request/response shapes match PMC API
 */
export const categoriesApi = {
  /**
   * Get all categories (flat list)
   * CONTRACT: GET /categories
   */
  getCategories: () => api.get<CategoryListResponse>('/categories'),

  /**
   * Get category by slug
   * CONTRACT: GET /categories/:slug
   */
  getCategory: (slug: string) => api.get<Category>(`/categories/${slug}`),

  /**
   * Get category tree (nested structure)
   * CONTRACT: GET /categories/tree
   */
  getCategoryTree: () => api.get<CategoryListResponse>('/categories/tree'),

  /**
   * Get child categories
   * CONTRACT: GET /categories/:id/children
   */
  getChildCategories: (parentId: string) =>
    api.get<CategoryListResponse>(`/categories/${parentId}/children`),

  /**
   * Get popular categories
   * CONTRACT: GET /categories/popular
   */
  getPopularCategories: (limit = 10) =>
    api.get<CategoryListResponse>(`/categories/popular?limit=${limit}`),
};

// Re-export types
export type { Category, CategoryListResponse };

export default categoriesApi;
