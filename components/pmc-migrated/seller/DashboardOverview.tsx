// MIGRATION: Seller dashboard overview from PMC
// VIPER: Visual consistency with Engine design system
// CONTRACT: Uses sellerApi for data fetching

'use client';

import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button } from 'antd';
import {
  ShoppingOutlined,
  DollarOutlined,
  InboxOutlined,
  WarningOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { sellerApi } from '@/lib/api/seller';
import type { SellerDashboardStats, Order, Review } from '@/lib/api/types';
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

/**
 * Seller Dashboard Overview Component
 * MIGRATION: Main dashboard view showing key stats and recent activity
 */
export function SellerDashboardOverview() {
  const [stats, setStats] = useState<SellerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ReturnType<typeof handleError> | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await sellerApi.getDashboardStats();
        setStats(data);
      } catch (err) {
        const displayError = handleError(err as Parameters<typeof handleError>[0]);
        setError(displayError);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardGrid columns={4}>
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </DashboardGrid>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
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

  if (!stats) {
    return null;
  }

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Link
          href={`/dashboard/orders/${id}`}
          className="text-blue-600 hover:underline"
        >
          #{id.slice(0, 8)}
        </Link>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Order['status']) => {
        const colors: Record<Order['status'], string> = {
          pending: 'orange',
          confirmed: 'blue',
          processing: 'cyan',
          shipped: 'geekblue',
          delivered: 'green',
          cancelled: 'red',
          refunded: 'purple',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number, record: Order) =>
        `${record.currency} ${total.toFixed(2)}`,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <DashboardGrid columns={4}>
        <StatCard
          label="Pending Orders"
          value={stats.pendingOrders}
          icon={<InboxOutlined />}
          changeType={stats.pendingOrders > 0 ? 'negative' : 'neutral'}
        />
        <StatCard
          label="Active Products"
          value={stats.activeProducts}
          icon={<ShoppingOutlined />}
        />
        <StatCard
          label="Low Stock"
          value={stats.lowStockProducts}
          icon={<WarningOutlined />}
          changeType={stats.lowStockProducts > 0 ? 'negative' : 'positive'}
        />
        <StatCard
          label="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarOutlined />}
        />
      </DashboardGrid>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card
          title="Recent Orders"
          extra={
            <Link href="/dashboard/orders">
              <Button type="link" icon={<ArrowRightOutlined />}>
                View All
              </Button>
            </Link>
          }
          className="rounded-2xl"
        >
          <Table
            dataSource={stats.recentOrders}
            columns={orderColumns}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </Card>

        {/* Recent Reviews */}
        <Card
          title="Recent Reviews"
          extra={
            <Link href="/dashboard/reviews">
              <Button type="link" icon={<ArrowRightOutlined />}>
                View All
              </Button>
            </Link>
          }
          className="rounded-2xl"
        >
          {stats.recentReviews.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {stats.recentReviews.slice(0, 5).map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{review.user.name}</span>
                    <span className="text-yellow-500">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                    {review.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" className="rounded-2xl">
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/products/new">
            <Button type="primary" icon={<ShoppingOutlined />}>
              Add New Product
            </Button>
          </Link>
          <Link href="/dashboard/orders?status=pending">
            <Button icon={<InboxOutlined />}>View Pending Orders</Button>
          </Link>
          <Link href="/dashboard/analytics">
            <Button icon={<DollarOutlined />}>View Analytics</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default SellerDashboardOverview;
