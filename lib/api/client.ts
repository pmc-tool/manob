// CONTRACT: Base API client with fetch wrapper and auth headers
// MIGRATION: Centralized API client for all PMC API calls

import type { ApiError } from './types';

// Microservice URLs
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_URL_INV = process.env.NEXT_PUBLIC_API_URL_INV || '';
const API_URL_CORE = process.env.NEXT_PUBLIC_API_URL_CORE || '';
const API_URL_ACC = process.env.NEXT_PUBLIC_API_URL_ACC || '';
const API_URL_JOBS = process.env.NEXT_PUBLIC_API_URL_JOBS || '';
const API_URL_ORDER = process.env.NEXT_PUBLIC_API_URL_ORDER || '';
const API_URL_FEED = process.env.NEXT_PUBLIC_API_URL_FEED || '';

export { API_URL_INV, API_URL_CORE, API_URL_ACC, API_URL_JOBS, API_URL_ORDER, API_URL_FEED };

// CONTRACT: Storage keys match PMC pattern exactly
const AUTH_TOKEN_KEY = 'pmc_access_token';
const REFRESH_TOKEN_KEY = 'pmc_refresh_token';

export interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  retries?: number;
}

/**
 * Get stored access token
 * CONTRACT: Uses same storage pattern as PMC
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Get stored refresh token
 * CONTRACT: Uses same storage pattern as PMC
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Store auth tokens
 * CONTRACT: Uses same storage pattern as PMC
 */
export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

/**
 * Clear auth tokens
 * CONTRACT: Uses same storage pattern as PMC
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Build full API URL
 */
function buildUrl(endpoint: string): string {
  // Remove leading slash if present for consistency
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
}

/**
 * Build request headers with auth
 * CONTRACT: Header format matches PMC API expectations
 */
function buildHeaders(options: RequestOptions = {}): Headers {
  const headers = new Headers(options.headers);

  // Set default content type if not provided
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Add auth header if not skipped and token exists
  if (!options.skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  return headers;
}

/**
 * Parse error response
 * CONTRACT: Error shape matches PMC API error format
 */
async function parseError(response: Response): Promise<ApiError> {
  try {
    const data = await response.json();
    return {
      code: data.code || 'UNKNOWN_ERROR',
      message: data.message || 'An unexpected error occurred',
      details: data.details,
      statusCode: response.status,
    };
  } catch {
    return {
      code: 'PARSE_ERROR',
      message: response.statusText || 'Failed to parse error response',
      statusCode: response.status,
    };
  }
}

/**
 * Handle token refresh
 * CONTRACT: Refresh endpoint and behavior matches PMC
 */
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(buildUrl('/auth/refresh'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return false;
    }

    const data = await response.json();
    setTokens(data.session.accessToken, data.session.refreshToken);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

/**
 * Main API request function with retry logic
 * CONTRACT: Retry behavior matches PMC pattern
 * VIPER: Engine error UI integration via error-handler.ts
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { retries = 3, ...fetchOptions } = options;
  const url = buildUrl(endpoint);
  const headers = buildHeaders(options);

  let lastError: ApiError | null = null;
  let attemptCount = 0;

  while (attemptCount < retries) {
    attemptCount++;

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      // Handle 401 - attempt token refresh on first try
      if (response.status === 401 && attemptCount === 1 && !options.skipAuth) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          // Update headers with new token and retry
          headers.set('Authorization', `Bearer ${getAccessToken()}`);
          continue;
        }
        // Refresh failed, throw auth error
        throw await parseError(response);
      }

      // Handle other errors
      if (!response.ok) {
        const error = await parseError(response);

        // CONTRACT: PMC retry logic - retry on 5xx errors
        if (response.status >= 500 && attemptCount < retries) {
          lastError = error;
          // Exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attemptCount) * 100)
          );
          continue;
        }

        throw error;
      }

      // Handle empty responses
      if (response.status === 204) {
        return undefined as T;
      }

      return await response.json();
    } catch (error) {
      if ((error as ApiError).statusCode) {
        throw error;
      }

      // Network error - retry if attempts remain
      if (attemptCount < retries) {
        lastError = {
          code: 'NETWORK_ERROR',
          message: 'Network request failed',
          statusCode: 0,
        };
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attemptCount) * 100)
        );
        continue;
      }

      throw lastError || {
        code: 'NETWORK_ERROR',
        message: 'Network request failed after retries',
        statusCode: 0,
      };
    }
  }

  throw lastError || {
    code: 'MAX_RETRIES',
    message: 'Maximum retry attempts exceeded',
    statusCode: 0,
  };
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
