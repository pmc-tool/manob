// CONTRACT: User API endpoints match PMC exactly
// MIGRATION: Centralized user API module

import { api } from './client';
import type {
  User,
  Order,
  OrderListResponse,
  Address,
  AddressListResponse,
  PaginationRequest,
  SuccessResponse,
} from './types';

/**
 * User API module
 * CONTRACT: All endpoints and request/response shapes match PMC API
 */
export const userApi = {
  // ============================================
  // Profile Endpoints
  // ============================================

  /**
   * Get user profile
   * CONTRACT: GET /user/profile
   */
  getProfile: () => api.get<User>('/user/profile'),

  /**
   * Update user profile
   * CONTRACT: PUT /user/profile
   */
  updateProfile: (data: Partial<User>) =>
    api.put<User>('/user/profile', data),

  /**
   * Upload avatar
   * CONTRACT: POST /user/avatar
   */
  uploadAvatar: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/user/avatar`,
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

  // ============================================
  // Address Endpoints
  // ============================================

  /**
   * Get user addresses
   * CONTRACT: GET /user/addresses
   */
  getAddresses: () => api.get<AddressListResponse>('/user/addresses'),

  /**
   * Add new address
   * CONTRACT: POST /user/addresses
   */
  addAddress: (data: Omit<Address, 'id' | 'userId'>) =>
    api.post<Address>('/user/addresses', data),

  /**
   * Update address
   * CONTRACT: PUT /user/addresses/:id
   */
  updateAddress: (id: string, data: Partial<Address>) =>
    api.put<Address>(`/user/addresses/${id}`, data),

  /**
   * Delete address
   * CONTRACT: DELETE /user/addresses/:id
   */
  deleteAddress: (id: string) =>
    api.delete<SuccessResponse>(`/user/addresses/${id}`),

  /**
   * Set default address
   * CONTRACT: POST /user/addresses/:id/default
   */
  setDefaultAddress: (id: string) =>
    api.post<Address>(`/user/addresses/${id}/default`, {}),

  // ============================================
  // Order Endpoints
  // ============================================

  /**
   * Get user orders
   * CONTRACT: GET /user/orders
   */
  getOrders: (params?: PaginationRequest & { status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.status) searchParams.set('status', params.status);
    const query = searchParams.toString();
    return api.get<OrderListResponse>(`/user/orders${query ? `?${query}` : ''}`);
  },

  /**
   * Get single order
   * CONTRACT: GET /user/orders/:id
   */
  getOrder: (id: string) => api.get<Order>(`/user/orders/${id}`),

  // ============================================
  // Wishlist Endpoints
  // ============================================

  /**
   * Get wishlist
   * CONTRACT: GET /user/wishlist
   */
  getWishlist: () =>
    api.get<{ items: { id: string; productId: string; createdAt: string }[] }>(
      '/user/wishlist'
    ),

  /**
   * Add to wishlist
   * CONTRACT: POST /user/wishlist
   */
  addToWishlist: (productId: string) =>
    api.post<SuccessResponse>('/user/wishlist', { productId }),

  /**
   * Remove from wishlist
   * CONTRACT: DELETE /user/wishlist/:productId
   */
  removeFromWishlist: (productId: string) =>
    api.delete<SuccessResponse>(`/user/wishlist/${productId}`),

  // ============================================
  // Notification Endpoints
  // ============================================

  /**
   * Get notification preferences
   * CONTRACT: GET /user/notifications/preferences
   */
  getNotificationPreferences: () =>
    api.get<{
      email: boolean;
      push: boolean;
      sms: boolean;
      marketing: boolean;
    }>('/user/notifications/preferences'),

  /**
   * Update notification preferences
   * CONTRACT: PUT /user/notifications/preferences
   */
  updateNotificationPreferences: (data: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    marketing?: boolean;
  }) => api.put<SuccessResponse>('/user/notifications/preferences', data),
};

export default userApi;
