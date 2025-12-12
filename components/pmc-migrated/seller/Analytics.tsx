// MIGRATION: Seller analytics from PMC
// VIPER: Visual consistency with Engine design system
// CONTRACT: Uses sellerApi for data fetching

'use client';

import React, { useEffect, useState } from 'react';
import { Card, Select, Table } from 'antd';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { sellerApi } from '@/lib/api/seller';
import type { SellerAnalytics, Product } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import {
  DashboardGrid,
  StatCard,
} from '@/components/pmc-migrated/shared/DashboardLayout';
import {
  LoadingState,
  CardSkeleton,
} from '@/components/pmc-migrated/shared/LoadingState';
import { ErrorDisplay } from '@/components/pmc-migrated/shared/ErrorBoundary';

const { Option } = Select;

type Period = 'day' | 'week' | 'month' | 'year';

/**
 * Seller Analytics Component
 * MIGRATION: Analytics dashboard with charts and metrics
 */
export function SellerAnalytics() {
  const [analytics, setAnalytics] = useState<SellerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ReturnType<typeof handleError> | null>(null);
  const [period, setPeriod] = useState<Period>('month');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await sellerApi.getAnalytics({ period });
        setAnalytics(data);
      } catch (err) {
        const displayError = handleError(err as Parameters<typeof handleError>[0]);
        setError(displayError);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardGrid columns={4}>
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </DashboardGrid>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={() => window.location.reload()}
        showRetry
      />
    );
  }

  if (!analytics) {
    return null;
  }

  const topProductColumns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (product: Product) => product.title,
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => `$${revenue.toLocaleString()}`,
      sorter: (a: SellerAnalytics['topProducts'][0], b: SellerAnalytics['topProducts'][0]) =>
        a.revenue - b.revenue,
    },
    {
      title: 'Orders',
      dataIndex: 'orders',
      key: 'orders',
      sorter: (a: SellerAnalytics['topProducts'][0], b: SellerAnalytics['topProducts'][0]) =>
        a.orders - b.orders,
    },
  ];

  const periodLabels: Record<Period, string> = {
    day: 'Today',
    week: 'This Week',
    month: 'This Month',
    year: 'This Year',
  };

  // Calculate growth percentage
  const revenueGrowth = analytics.totalRevenue > 0
    ? ((analytics.periodRevenue / analytics.totalRevenue) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-end">
        <Select value={period} onChange={setPeriod} className="w-40">
          <Option value="day">Today</Option>
          <Option value="week">This Week</Option>
          <Option value="month">This Month</Option>
          <Option value="year">This Year</Option>
        </Select>
      </div>

      {/* Key Metrics */}
      <DashboardGrid columns={4}>
        <StatCard
          label="Total Revenue"
          value={`$${analytics.totalRevenue.toLocaleString()}`}
          icon={<DollarOutlined />}
        />
        <StatCard
          label={`${periodLabels[period]} Revenue`}
          value={`$${analytics.periodRevenue.toLocaleString()}`}
          change={`${revenueGrowth}% of total`}
          changeType="positive"
          icon={<RiseOutlined />}
        />
        <StatCard
          label="Total Orders"
          value={analytics.totalOrders}
          icon={<ShoppingCartOutlined />}
        />
        <StatCard
          label={`${periodLabels[period]} Orders`}
          value={analytics.periodOrders}
          icon={<ShoppingCartOutlined />}
        />
      </DashboardGrid>

      {/* Revenue Chart */}
      <Card title="Revenue Over Time" className="rounded-2xl">
        <div className="h-64">
          {analytics.revenueByDay.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              No revenue data for this period
            </div>
          ) : (
            <div className="flex h-full flex-col">
              {/* Simple bar chart visualization */}
              <div className="flex flex-1 items-end gap-1">
                {analytics.revenueByDay.map((day, index) => {
                  const maxAmount = Math.max(
                    ...analytics.revenueByDay.map((d) => d.amount)
                  );
                  const height = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0;
                  return (
                    <div
                      key={index}
                      className="group relative flex-1 min-w-0"
                      title={`${day.date}: $${day.amount.toLocaleString()}`}
                    >
                      <div
                        className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                        style={{ height: `${height}%`, minHeight: '2px' }}
                      />
                      <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                        ${day.amount.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* X-axis labels */}
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                {analytics.revenueByDay.length > 0 && (
                  <>
                    <span>
                      {new Date(analytics.revenueByDay[0].date).toLocaleDateString(
                        undefined,
                        { month: 'short', day: 'numeric' }
                      )}
                    </span>
                    <span>
                      {new Date(
                        analytics.revenueByDay[analytics.revenueByDay.length - 1].date
                      ).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Orders Chart */}
      <Card title="Orders Over Time" className="rounded-2xl">
        <div className="h-64">
          {analytics.ordersByDay.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              No order data for this period
            </div>
          ) : (
            <div className="flex h-full flex-col">
              {/* Simple bar chart visualization */}
              <div className="flex flex-1 items-end gap-1">
                {analytics.ordersByDay.map((day, index) => {
                  const maxCount = Math.max(
                    ...analytics.ordersByDay.map((d) => d.count)
                  );
                  const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                  return (
                    <div
                      key={index}
                      className="group relative flex-1 min-w-0"
                      title={`${day.date}: ${day.count} orders`}
                    >
                      <div
                        className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                        style={{ height: `${height}%`, minHeight: '2px' }}
                      />
                      <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                        {day.count} orders
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* X-axis labels */}
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                {analytics.ordersByDay.length > 0 && (
                  <>
                    <span>
                      {new Date(analytics.ordersByDay[0].date).toLocaleDateString(
                        undefined,
                        { month: 'short', day: 'numeric' }
                      )}
                    </span>
                    <span>
                      {new Date(
                        analytics.ordersByDay[analytics.ordersByDay.length - 1].date
                      ).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Top Products */}
      <Card title="Top Performing Products" className="rounded-2xl">
        <Table
          dataSource={analytics.topProducts}
          columns={topProductColumns}
          rowKey={(record) => record.product.id}
          pagination={false}
        />
      </Card>

      {/* Additional Stats */}
      <DashboardGrid columns={2}>
        <Card className="rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <ShoppingCartOutlined className="text-xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold">{analytics.totalProducts}</p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <EyeOutlined className="text-xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-bold">
                {analytics.totalViews.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </DashboardGrid>
    </div>
  );
}

export default SellerAnalytics;
