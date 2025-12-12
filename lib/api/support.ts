// CONTRACT: Support API endpoints match PMC exactly
// MIGRATION: Centralized support API module

import { api } from './client';
import type {
  SupportTicket,
  SupportTicketListResponse,
  SupportTicketCreateRequest,
  SupportMessageCreateRequest,
  SupportMessage,
  PaginationRequest,
  SuccessResponse,
} from './types';

/**
 * Support API module
 * CONTRACT: All endpoints and request/response shapes match PMC API
 */
export const supportApi = {
  /**
   * Get user's support tickets
   * CONTRACT: GET /support/tickets
   */
  getTickets: (params?: PaginationRequest & { status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.status) searchParams.set('status', params.status);
    const query = searchParams.toString();
    return api.get<SupportTicketListResponse>(
      `/support/tickets${query ? `?${query}` : ''}`
    );
  },

  /**
   * Get single ticket
   * CONTRACT: GET /support/tickets/:id
   */
  getTicket: (id: string) => api.get<SupportTicket>(`/support/tickets/${id}`),

  /**
   * Create support ticket
   * CONTRACT: POST /support/tickets
   */
  createTicket: (data: SupportTicketCreateRequest) =>
    api.post<SupportTicket>('/support/tickets', data),

  /**
   * Add message to ticket
   * CONTRACT: POST /support/tickets/:id/messages
   */
  addMessage: (ticketId: string, data: Omit<SupportMessageCreateRequest, 'ticketId'>) =>
    api.post<SupportMessage>(`/support/tickets/${ticketId}/messages`, data),

  /**
   * Close ticket
   * CONTRACT: POST /support/tickets/:id/close
   */
  closeTicket: (id: string) =>
    api.post<SupportTicket>(`/support/tickets/${id}/close`, {}),

  /**
   * Reopen ticket
   * CONTRACT: POST /support/tickets/:id/reopen
   */
  reopenTicket: (id: string) =>
    api.post<SupportTicket>(`/support/tickets/${id}/reopen`, {}),

  /**
   * Get support categories
   * CONTRACT: GET /support/categories
   */
  getCategories: () =>
    api.get<{ categories: string[] }>('/support/categories'),

  /**
   * Get FAQ articles
   * CONTRACT: GET /support/faq
   */
  getFAQ: () =>
    api.get<{
      articles: { id: string; question: string; answer: string; category: string }[];
    }>('/support/faq'),
};

export default supportApi;
