// CONTRACT: PMC retry logic preserved
// VIPER: Engine toast UI for error display
// MIGRATION: Hybrid error handling - PMC retry + Engine UI

import type { ApiError, ValidationError } from './types';

/**
 * Error severity levels for UI display
 */
export type ErrorSeverity = 'error' | 'warning' | 'info';

/**
 * Formatted error for UI display
 */
export interface DisplayError {
  title: string;
  message: string;
  severity: ErrorSeverity;
  code?: string;
  validationErrors?: ValidationError[];
  retryable: boolean;
}

/**
 * Toast notification callback type
 * VIPER: Integrates with Engine's toast system
 */
export type ToastCallback = (error: DisplayError) => void;

// Global toast callback - set by UI layer
let toastCallback: ToastCallback | null = null;

/**
 * Register toast callback for error display
 * VIPER: Called by Engine UI layer to register toast handler
 */
export function registerToastHandler(callback: ToastCallback): void {
  toastCallback = callback;
}

/**
 * Unregister toast callback
 */
export function unregisterToastHandler(): void {
  toastCallback = null;
}

/**
 * Map API error codes to user-friendly messages
 * CONTRACT: Error codes match PMC API error codes
 */
const ERROR_MESSAGES: Record<string, string> = {
  // Auth errors
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  ACCOUNT_NOT_FOUND: 'No account found with this email address.',
  ACCOUNT_DISABLED: 'Your account has been disabled. Please contact support.',
  EMAIL_NOT_VERIFIED: 'Please verify your email address before signing in.',
  OTP_INVALID: 'Invalid verification code. Please try again.',
  OTP_EXPIRED: 'Verification code has expired. Please request a new one.',
  TOKEN_EXPIRED: 'Your session has expired. Please sign in again.',
  TOKEN_INVALID: 'Invalid authentication token. Please sign in again.',

  // Validation errors
  VALIDATION_ERROR: 'Please check your input and try again.',
  INVALID_INPUT: 'Invalid input provided.',

  // Resource errors
  NOT_FOUND: 'The requested resource was not found.',
  ALREADY_EXISTS: 'This resource already exists.',
  CONFLICT: 'This operation conflicts with the current state.',

  // Permission errors
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',

  // Rate limiting
  RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',

  // Server errors
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable. Please try again later.',

  // Network errors
  NETWORK_ERROR: 'Unable to connect to the server. Please check your connection.',
  TIMEOUT: 'Request timed out. Please try again.',

  // Generic
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

/**
 * Get user-friendly error message
 */
function getErrorMessage(code: string, defaultMessage?: string): string {
  return ERROR_MESSAGES[code] || defaultMessage || ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Determine error severity based on status code and type
 */
function getErrorSeverity(error: ApiError): ErrorSeverity {
  // 4xx client errors are typically warnings (user can fix)
  if (error.statusCode >= 400 && error.statusCode < 500) {
    return 'warning';
  }
  // 5xx server errors are errors
  if (error.statusCode >= 500) {
    return 'error';
  }
  // Network errors
  if (error.statusCode === 0) {
    return 'error';
  }
  return 'error';
}

/**
 * Determine if error is retryable
 * CONTRACT: Matches PMC retry logic
 */
function isRetryable(error: ApiError): boolean {
  // Network errors are retryable
  if (error.statusCode === 0) {
    return true;
  }
  // 5xx server errors are retryable
  if (error.statusCode >= 500) {
    return true;
  }
  // Rate limiting is retryable (after waiting)
  if (error.code === 'RATE_LIMITED' || error.statusCode === 429) {
    return true;
  }
  return false;
}

/**
 * Get error title based on error type
 */
function getErrorTitle(error: ApiError): string {
  switch (error.statusCode) {
    case 400:
      return 'Invalid Request';
    case 401:
      return 'Authentication Required';
    case 403:
      return 'Access Denied';
    case 404:
      return 'Not Found';
    case 409:
      return 'Conflict';
    case 422:
      return 'Validation Error';
    case 429:
      return 'Too Many Requests';
    case 500:
      return 'Server Error';
    case 502:
    case 503:
    case 504:
      return 'Service Unavailable';
    case 0:
      return 'Connection Error';
    default:
      return 'Error';
  }
}

/**
 * Parse validation errors from API response
 */
function parseValidationErrors(
  details?: Record<string, string[]>
): ValidationError[] | undefined {
  if (!details) return undefined;

  const errors: ValidationError[] = [];
  for (const [field, messages] of Object.entries(details)) {
    for (const message of messages) {
      errors.push({ field, message });
    }
  }
  return errors.length > 0 ? errors : undefined;
}

/**
 * Format API error for display
 * VIPER: Prepares error for Engine UI display
 */
export function formatError(error: ApiError): DisplayError {
  return {
    title: getErrorTitle(error),
    message: getErrorMessage(error.code, error.message),
    severity: getErrorSeverity(error),
    code: error.code,
    validationErrors: parseValidationErrors(error.details),
    retryable: isRetryable(error),
  };
}

/**
 * Handle API error - format and optionally show toast
 * VIPER: Main error handler integrating PMC logic with Engine UI
 */
export function handleError(
  error: ApiError,
  options: { showToast?: boolean; silent?: boolean } = {}
): DisplayError {
  const { showToast = true, silent = false } = options;

  const displayError = formatError(error);

  // Log error in development
  if (process.env.NODE_ENV === 'development' && !silent) {
    console.error('[API Error]', {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    });
  }

  // Show toast if enabled and callback registered
  if (showToast && toastCallback && !silent) {
    toastCallback(displayError);
  }

  return displayError;
}

/**
 * Type guard for API errors
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'statusCode' in error
  );
}

/**
 * Create a standardized error from any caught exception
 */
export function normalizeError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      statusCode: 0,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    statusCode: 0,
  };
}

/**
 * Utility to handle errors in async operations
 * Usage: const [data, error] = await safeAsync(apiCall());
 */
export async function safeAsync<T>(
  promise: Promise<T>
): Promise<[T, null] | [null, DisplayError]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    const displayError = handleError(normalizeError(error), { showToast: false });
    return [null, displayError];
  }
}
