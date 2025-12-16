// MIGRATION: Error boundary component using Engine patterns
// VIPER: Reliability - graceful error handling with recovery options

'use client';

import React, { Component, type ReactNode } from 'react';
import { Button, Result } from 'antd';
import { ReloadOutlined, HomeOutlined } from '@ant-design/icons';
import type { DisplayError } from '@/lib/api/error-handler';

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback component */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Whether to show home button */
  showHomeButton?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component for catching React errors
 * VIPER: Reliability - prevents full app crash on component errors
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary]', error, errorInfo);
    }

    // Call error callback if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { children, fallback, showHomeButton = true } = this.props;
    const { hasError, error } = this.state;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback(error, this.handleReset);
        }
        return fallback;
      }

      // Default error UI using Engine design patterns
      return (
        <div className="flex min-h-[400px] items-center justify-center p-8">
          <Result
            status="error"
            title="Something went wrong"
            subTitle={
              process.env.NODE_ENV === 'development'
                ? error.message
                : 'An unexpected error occurred. Please try again.'
            }
            extra={[
              <Button
                key="retry"
                type="primary"
                icon={<ReloadOutlined />}
                onClick={this.handleReset}
              >
                Try Again
              </Button>,
              showHomeButton && (
                <Button
                  key="home"
                  icon={<HomeOutlined />}
                  onClick={() => (window.location.href = '/')}
                >
                  Go Home
                </Button>
              ),
            ].filter(Boolean)}
          />
        </div>
      );
    }

    return children;
  }
}

/**
 * Props for ErrorDisplay component
 */
export interface ErrorDisplayProps {
  error: DisplayError;
  onRetry?: () => void;
  onDismiss?: () => void;
  showRetry?: boolean;
  className?: string;
}

/**
 * Error display component for API errors
 * VIPER: Visual - consistent error display using Engine tokens
 */
export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  showRetry = true,
  className = '',
}: ErrorDisplayProps) {
  const status = error.severity === 'error' ? 'error' : 'warning';

  return (
    <div className={`rounded-mdxl border border-gray-200 bg-white p-6 ${className}`}>
      <Result
        status={status}
        title={error.title}
        subTitle={error.message}
        extra={[
          showRetry && error.retryable && onRetry && (
            <Button
              key="retry"
              type="primary"
              icon={<ReloadOutlined />}
              onClick={onRetry}
            >
              Try Again
            </Button>
          ),
          onDismiss && (
            <Button key="dismiss" onClick={onDismiss}>
              Dismiss
            </Button>
          ),
        ].filter(Boolean)}
      />
      {error.validationErrors && error.validationErrors.length > 0 && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="mb-2 text-sm font-medium text-gray-700">
            Please fix the following:
          </p>
          <ul className="list-inside list-disc space-y-1 text-sm text-red-600">
            {error.validationErrors.map((ve, i) => (
              <li key={i}>
                <span className="font-medium">{ve.field}:</span> {ve.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Inline error message component
 */
export function ErrorMessage({
  message,
  className = '',
}: {
  message: string;
  className?: string;
}) {
  return (
    <p className={`text-sm text-red-600 ${className}`} role="alert">
      {message}
    </p>
  );
}

/**
 * Empty state component
 * VIPER: Visual - consistent empty state display
 */
export function EmptyState({
  title = 'No data',
  description,
  action,
  icon,
  className = '',
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex min-h-[200px] flex-col items-center justify-center p-8 text-center ${className}`}
    >
      {icon && <div className="mb-4 text-4xl text-gray-300">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default ErrorBoundary;
