// CONTRACT: Product API endpoints match PMC exactly
// MIGRATION: Centralized product API module

import { api } from './client';
import type {
  Product,
  ProductListResponse,
  Service,
  ServiceListResponse,
  Job,
  JobListResponse,
  Category,
  CategoryListResponse,
  ReviewListResponse,
  PaginationRequest,
} from './types';

/**
 * Products API module
 * CONTRACT: All endpoints and request/response shapes match PMC API
 */
export const productsApi = {
  // ============================================
  // Product Endpoints
  // ============================================

  /**
   * Get all products with filters
   * CONTRACT: GET /products
   */
  getProducts: (
    params?: PaginationRequest & {
      categoryId?: string;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
      search?: string;
    }
  ) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
    if (params?.minPrice) searchParams.set('minPrice', String(params.minPrice));
    if (params?.maxPrice) searchParams.set('maxPrice', String(params.maxPrice));
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.search) searchParams.set('search', params.search);
    const query = searchParams.toString();
    return api.get<ProductListResponse>(`/products${query ? `?${query}` : ''}`);
  },

  /**
   * Get single product by ID
   * CONTRACT: GET /products/:id
   */
  getProduct: (id: string) => api.get<Product>(`/products/${id}`),

  /**
   * Get featured products
   * CONTRACT: GET /products/featured
   */
  getFeaturedProducts: (limit = 10) =>
    api.get<ProductListResponse>(`/products/featured?limit=${limit}`),

  /**
   * Get products by category
   * CONTRACT: GET /products/category/:categoryId
   */
  getProductsByCategory: (categoryId: string, params?: PaginationRequest) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const query = searchParams.toString();
    return api.get<ProductListResponse>(
      `/products/category/${categoryId}${query ? `?${query}` : ''}`
    );
  },

  /**
   * Get product reviews
   * CONTRACT: GET /products/:id/reviews
   */
  getProductReviews: (id: string, params?: PaginationRequest) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const query = searchParams.toString();
    return api.get<ReviewListResponse>(
      `/products/${id}/reviews${query ? `?${query}` : ''}`
    );
  },

  // ============================================
  // Service Endpoints
  // ============================================

  /**
   * Get all services with filters
   * CONTRACT: GET /services
   */
  getServices: (
    params?: PaginationRequest & {
      categoryId?: string;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
      search?: string;
    }
  ) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
    if (params?.minPrice) searchParams.set('minPrice', String(params.minPrice));
    if (params?.maxPrice) searchParams.set('maxPrice', String(params.maxPrice));
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.search) searchParams.set('search', params.search);
    const query = searchParams.toString();
    return api.get<ServiceListResponse>(`/services${query ? `?${query}` : ''}`);
  },

  /**
   * Get single service by ID
   * CONTRACT: GET /services/:id
   */
  getService: (id: string) => api.get<Service>(`/services/${id}`),

  /**
   * Get service reviews
   * CONTRACT: GET /services/:id/reviews
   */
  getServiceReviews: (id: string, params?: PaginationRequest) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const query = searchParams.toString();
    return api.get<ReviewListResponse>(
      `/services/${id}/reviews${query ? `?${query}` : ''}`
    );
  },

  // ============================================
  // Job Endpoints
  // ============================================

  /**
   * Get all jobs with filters
   * CONTRACT: GET /jobs
   */
  getJobs: (
    params?: PaginationRequest & {
      categoryId?: string;
      minBudget?: number;
      maxBudget?: number;
      budgetType?: 'fixed' | 'hourly';
      status?: 'open' | 'in_progress' | 'completed';
      sortBy?: 'budget_asc' | 'budget_desc' | 'newest';
      search?: string;
    }
  ) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
    if (params?.minBudget) searchParams.set('minBudget', String(params.minBudget));
    if (params?.maxBudget) searchParams.set('maxBudget', String(params.maxBudget));
    if (params?.budgetType) searchParams.set('budgetType', params.budgetType);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.search) searchParams.set('search', params.search);
    const query = searchParams.toString();
    return api.get<JobListResponse>(`/jobs${query ? `?${query}` : ''}`);
  },

  /**
   * Get single job by ID
   * CONTRACT: GET /jobs/:id
   */
  getJob: (id: string) => api.get<Job>(`/jobs/${id}`),

  // ============================================
  // Category Endpoints
  // ============================================

  /**
   * Get all categories
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
};

// Re-export types for convenience
export type {
  Product,
  ProductListResponse,
  Service,
  ServiceListResponse,
  Job,
  JobListResponse,
  Category,
  CategoryListResponse,
};

export default productsApi;
