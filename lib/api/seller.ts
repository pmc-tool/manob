// CONTRACT: Seller API endpoints match PMC exactly
// MIGRATION: Centralized seller API module

import { api } from './client';
import type {
  SellerProfile,
  SellerApplication,
  SellerApplicationRequest,
  SellerAnalytics,
  SellerDashboardStats,
  Product,
  ProductListResponse,
  ProductCreateRequest,
  ProductUpdateRequest,
  Order,
  OrderListResponse,
  SuccessResponse,
  DeleteResponse,
  PaginationRequest,
} from './types';

/**
 * Seller API module
 * CONTRACT: All endpoints and request/response shapes match PMC API
 */
export const sellerApi = {
  // ============================================
  // Profile Endpoints
  // ============================================

  /**
   * Get seller profile
   * CONTRACT: GET /seller/profile
   */
  getProfile: () => api.get<SellerProfile>('/seller/profile'),

  /**
   * Update seller profile
   * CONTRACT: PUT /seller/profile
   */
  updateProfile: (data: Partial<SellerProfile>) =>
    api.put<SellerProfile>('/seller/profile', data),

  /**
   * Get seller by ID (public profile)
   * CONTRACT: GET /sellers/:id
   */
  getSellerById: (id: string) => api.get<SellerProfile>(`/sellers/${id}`),

  // ============================================
  // Dashboard Endpoints
  // ============================================

  /**
   * Get seller dashboard stats
   * CONTRACT: GET /seller/dashboard/stats
   */
  getDashboardStats: () =>
    api.get<SellerDashboardStats>('/seller/dashboard/stats'),

  /**
   * Get seller analytics
   * CONTRACT: GET /seller/analytics
   */
  getAnalytics: (params?: { period?: 'day' | 'week' | 'month' | 'year' }) => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.set('period', params.period);
    const query = searchParams.toString();
    return api.get<SellerAnalytics>(`/seller/analytics${query ? `?${query}` : ''}`);
  },

  // ============================================
  // Product Management Endpoints
  // ============================================

  /**
   * Get seller's products
   * CONTRACT: GET /seller/products
   */
  getProducts: (params?: PaginationRequest & { status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.status) searchParams.set('status', params.status);
    const query = searchParams.toString();
    return api.get<ProductListResponse>(
      `/seller/products${query ? `?${query}` : ''}`
    );
  },

  /**
   * Get single product by ID
   * CONTRACT: GET /seller/products/:id
   */
  getProduct: (id: string) => api.get<Product>(`/seller/products/${id}`),

  /**
   * Create new product
   * CONTRACT: POST /seller/products
   */
  createProduct: (data: ProductCreateRequest) =>
    api.post<Product>('/seller/products', data),

  /**
   * Update product
   * CONTRACT: PUT /seller/products/:id
   */
  updateProduct: (id: string, data: Partial<ProductCreateRequest>) =>
    api.put<Product>(`/seller/products/${id}`, data),

  /**
   * Delete product
   * CONTRACT: DELETE /seller/products/:id
   */
  deleteProduct: (id: string) =>
    api.delete<DeleteResponse>(`/seller/products/${id}`),

  /**
   * Update product status
   * CONTRACT: PATCH /seller/products/:id/status
   */
  updateProductStatus: (id: string, status: 'active' | 'inactive') =>
    api.patch<Product>(`/seller/products/${id}/status`, { status }),

  // ============================================
  // Order Management Endpoints
  // ============================================

  /**
   * Get seller's orders
   * CONTRACT: GET /seller/orders
   */
  getOrders: (
    params?: PaginationRequest & { status?: string; sortBy?: string }
  ) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.status) searchParams.set('status', params.status);
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    const query = searchParams.toString();
    return api.get<OrderListResponse>(
      `/seller/orders${query ? `?${query}` : ''}`
    );
  },

  /**
   * Get single order by ID
   * CONTRACT: GET /seller/orders/:id
   */
  getOrder: (id: string) => api.get<Order>(`/seller/orders/${id}`),

  /**
   * Update order status
   * CONTRACT: PATCH /seller/orders/:id/status
   */
  updateOrderStatus: (
    id: string,
    status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
    trackingNumber?: string
  ) =>
    api.patch<Order>(`/seller/orders/${id}/status`, { status, trackingNumber }),

  // ============================================
  // Become Seller Endpoints
  // ============================================

  /**
   * Submit seller application
   * CONTRACT: POST /seller/apply
   */
  submitApplication: (data: SellerApplicationRequest) =>
    api.post<SellerApplication>('/seller/apply', data),

  /**
   * Get application status
   * CONTRACT: GET /seller/application
   */
  getApplicationStatus: () =>
    api.get<SellerApplication>('/seller/application'),

  // ============================================
  // Image Upload
  // ============================================

  /**
   * Upload product image
   * CONTRACT: POST /seller/upload/image
   * Note: This uses FormData, not JSON
   */
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/seller/upload/image`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pmc_access_token')}`,
        },
      }
    );

    if (!response.ok) {
      throw await response.json();
    }

    return response.json();
  },
};

export default sellerApi;
