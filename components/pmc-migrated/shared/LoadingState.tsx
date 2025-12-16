// MIGRATION: Loading state component using Engine patterns
// VIPER: Visual consistency with PMC Engine design system

'use client';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export interface LoadingStateProps {
  /** Loading message to display */
  message?: string;
  /** Size of the spinner */
  size?: 'small' | 'default' | 'large';
  /** Whether to show full page loading overlay */
  fullPage?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Loading state component
 * VIPER: Uses Engine design tokens for consistent styling
 */
export function LoadingState({
  message = 'Loading...',
  size = 'default',
  fullPage = false,
  className = '',
}: LoadingStateProps) {
  const spinnerSize = size === 'small' ? 24 : size === 'large' ? 48 : 32;

  const spinner = (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <Spin
        indicator={
          <LoadingOutlined
            style={{ fontSize: spinnerSize }}
            spin
            className="text-blue-600"
          />
        }
      />
      {message && (
        <p className="text-sm text-gray-500 animate-pulse">{message}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex min-h-[200px] items-center justify-center p-8">
      {spinner}
    </div>
  );
}

/**
 * Inline loading spinner for buttons and small areas
 */
export function LoadingSpinner({
  size = 16,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Spin
      indicator={
        <LoadingOutlined style={{ fontSize: size }} spin className={className} />
      }
    />
  );
}

/**
 * Skeleton loading placeholder
 * VIPER: Consistent skeleton styling with Engine
 */
export function LoadingSkeleton({
  width = '100%',
  height = 20,
  rounded = false,
  className = '',
}: {
  width?: string | number;
  height?: number;
  rounded?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse bg-gray-200 ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: `${height}px`,
      }}
    />
  );
}

/**
 * Card skeleton for loading states
 */
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-mdxl border border-gray-200 bg-white p-6 ${className}`}
    >
      <LoadingSkeleton height={24} width="60%" className="mb-4" />
      <LoadingSkeleton height={16} className="mb-2" />
      <LoadingSkeleton height={16} className="mb-2" />
      <LoadingSkeleton height={16} width="80%" />
    </div>
  );
}

/**
 * Table row skeleton
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <LoadingSkeleton height={16} width={`${60 + Math.random() * 30}%`} />
        </td>
      ))}
    </tr>
  );
}

/**
 * List item skeleton
 */
export function ListItemSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 ${className}`}
    >
      <LoadingSkeleton width={48} height={48} rounded className="flex-shrink-0" />
      <div className="flex-1">
        <LoadingSkeleton height={18} width="70%" className="mb-2" />
        <LoadingSkeleton height={14} width="50%" />
      </div>
    </div>
  );
}

export default LoadingState;
