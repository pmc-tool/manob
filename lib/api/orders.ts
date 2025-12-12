// CONTRACT: Orders API endpoints match PMC exactly
// MIGRATION: Centralized orders API module

import { api } from './client';
import type {
  Order,
  OrderListResponse,
  OrderCreateRequest,
  SuccessResponse,
  PaginationRequest,
} from './types';

/**
 * Orders API module
 * CONTRACT: All endpoints and request/response shapes match PMC API
 */
export const ordersApi = {
  // ============================================
  // User Order Endpoints
  // ============================================

  /**
   * Get user's orders
   * CONTRACT: GET /orders
   */
  getOrders: (params?: PaginationRequest & { status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.status) searchParams.set('status', params.status);
    const query = searchParams.toString();
    return api.get<OrderListResponse>(`/orders${query ? `?${query}` : ''}`);
  },

  /**
   * Get single order by ID
   * CONTRACT: GET /orders/:id
   */
  getOrder: (id: string) => api.get<Order>(`/orders/${id}`),

  /**
   * Create new order (checkout)
   * CONTRACT: POST /orders
   */
  createOrder: (data: OrderCreateRequest) =>
    api.post<Order>('/orders', data),

  /**
   * Cancel order
   * CONTRACT: POST /orders/:id/cancel
   */
  cancelOrder: (id: string, reason?: string) =>
    api.post<Order>(`/orders/${id}/cancel`, { reason }),

  /**
   * Request refund
   * CONTRACT: POST /orders/:id/refund
   */
  requestRefund: (id: string, reason: string) =>
    api.post<Order>(`/orders/${id}/refund`, { reason }),

  // ============================================
  // Order Tracking
  // ============================================

  /**
   * Get order tracking info
   * CONTRACT: GET /orders/:id/tracking
   */
  getOrderTracking: (id: string) =>
    api.get<{
      orderId: string;
      status: string;
      trackingNumber?: string;
      carrier?: string;
      estimatedDelivery?: string;
      events: {
        date: string;
        status: string;
        location?: string;
        description: string;
      }[];
    }>(`/orders/${id}/tracking`),

  // ============================================
  // Order Reviews
  // ============================================

  /**
   * Submit order review
   * CONTRACT: POST /orders/:id/review
   */
  submitReview: (
    orderId: string,
    data: {
      rating: number;
      title?: string;
      content: string;
      images?: string[];
    }
  ) =>
    api.post<SuccessResponse>(`/orders/${orderId}/review`, data),

  // ============================================
  // Order Documents
  // ============================================

  /**
   * Get order invoice URL
   * CONTRACT: GET /orders/:id/invoice
   */
  getInvoice: (id: string) =>
    api.get<{ url: string }>(`/orders/${id}/invoice`),

  /**
   * Get order receipt URL
   * CONTRACT: GET /orders/:id/receipt
   */
  getReceipt: (id: string) =>
    api.get<{ url: string }>(`/orders/${id}/receipt`),
};

// Re-export types for convenience
export type { Order, OrderListResponse, OrderCreateRequest };

export default ordersApi;
