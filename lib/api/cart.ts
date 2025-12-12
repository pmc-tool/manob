// CONTRACT: Cart API endpoints match PMC exactly
// MIGRATION: Centralized cart API module

import { api } from './client';
import type {
  Cart,
  CartAddRequest,
  CartUpdateRequest,
  CartRemoveRequest,
  SuccessResponse,
} from './types';

/**
 * Cart API module
 * CONTRACT: All endpoints and request/response shapes match PMC API
 */
export const cartApi = {
  /**
   * Get current cart
   * CONTRACT: GET /cart
   */
  getCart: () => api.get<Cart>('/cart'),

  /**
   * Add item to cart
   * CONTRACT: POST /cart/items
   */
  addItem: (data: CartAddRequest) => api.post<Cart>('/cart/items', data),

  /**
   * Update cart item quantity
   * CONTRACT: PUT /cart/items/:itemId
   */
  updateItem: (itemId: string, quantity: number) =>
    api.put<Cart>(`/cart/items/${itemId}`, { quantity }),

  /**
   * Remove item from cart
   * CONTRACT: DELETE /cart/items/:itemId
   */
  removeItem: (itemId: string) => api.delete<Cart>(`/cart/items/${itemId}`),

  /**
   * Clear cart
   * CONTRACT: DELETE /cart
   */
  clearCart: () => api.delete<SuccessResponse>('/cart'),

  /**
   * Apply coupon code
   * CONTRACT: POST /cart/coupon
   */
  applyCoupon: (code: string) =>
    api.post<Cart & { discount: number }>('/cart/coupon', { code }),

  /**
   * Remove coupon code
   * CONTRACT: DELETE /cart/coupon
   */
  removeCoupon: () => api.delete<Cart>('/cart/coupon'),

  /**
   * Get cart summary for checkout
   * CONTRACT: GET /cart/summary
   */
  getSummary: () =>
    api.get<{
      subtotal: number;
      tax: number;
      shipping: number;
      discount: number;
      total: number;
      itemCount: number;
    }>('/cart/summary'),
};

// Re-export types
export type { Cart, CartAddRequest, CartUpdateRequest, CartRemoveRequest };

export default cartApi;
