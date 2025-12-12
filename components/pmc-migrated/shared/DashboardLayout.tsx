// MIGRATION: Dashboard wrapper for migrated PMC pages
// VIPER: Ensures sidebar and chat remain stable
// CONTRACT: Renders within Engine shell without header/footer

'use client';

import React, { type ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingState } from './LoadingState';
import { useAuth } from '@/context/AuthContext';

export interface DashboardLayoutProps {
  children: ReactNode;
  /** Page title for breadcrumb/header */
  title?: string;
  /** Page subtitle or description */
  subtitle?: string;
  /** Whether to show loading state while auth is loading */
  requireAuth?: boolean;
  /** Maximum width constraint for content */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Additional CSS classes for the container */
  className?: string;
  /** Breadcrumb items */
  breadcrumbs?: { label: string; href?: string }[];
  /** Right-side header actions */
  actions?: ReactNode;
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
};

/**
 * Dashboard Layout wrapper for migrated PMC pages
 *
 * MIGRATION: This component wraps all migrated pages to ensure:
 * - No header/footer is rendered (dashboard-only shell)
 * - Sidebar and chat remain stable
 * - Consistent error handling
 * - Auth state is available
 *
 * VIPER: Maintains visual consistency with Engine design system
 */
export function DashboardLayout({
  children,
  title,
  subtitle,
  requireAuth = false,
  maxWidth = 'xl',
  className = '',
  breadcrumbs,
  actions,
}: DashboardLayoutProps) {
  const { isLoading, isAuthenticated } = useAuth();

  // Show loading state while checking auth
  if (requireAuth && isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingState message="Loading..." />
      </div>
    );
  }

  // Show auth required message if not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Authentication Required
        </h2>
        <p className="mt-2 text-gray-500">
          Please sign in to access this page.
        </p>
        <a
          href="/sign-in"
          className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div
        className={`mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}
      >
        {/* Page Header */}
        {(title || breadcrumbs || actions) && (
          <div className="mb-6">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="mb-2" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center">
                      {index > 0 && <span className="mx-2">/</span>}
                      {crumb.href ? (
                        <a
                          href={crumb.href}
                          className="hover:text-gray-700 hover:underline"
                        >
                          {crumb.label}
                        </a>
                      ) : (
                        <span className="text-gray-900">{crumb.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* Title and Actions Row */}
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                )}
              </div>
              {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="relative">{children}</div>
      </div>
    </ErrorBoundary>
  );
}

/**
 * Section component for grouping content within dashboard
 * VIPER: Visual consistency with Engine card styling
 */
export function DashboardSection({
  title,
  description,
  children,
  actions,
  className = '',
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-gray-200 bg-white p-6 ${className}`}
    >
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * Grid layout for dashboard cards
 */
export function DashboardGrid({
  children,
  columns = 3,
  className = '',
}: {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-6 ${gridClasses[columns]} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Stat card for dashboard metrics
 * VIPER: Visual consistency with Engine design system
 */
export function StatCard({
  label,
  value,
  change,
  changeType = 'neutral',
  icon,
  className = '',
}: {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  className?: string;
}) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-500',
  };

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {change && (
        <p className={`mt-1 text-sm ${changeColors[changeType]}`}>{change}</p>
      )}
    </div>
  );
}

export default DashboardLayout;
