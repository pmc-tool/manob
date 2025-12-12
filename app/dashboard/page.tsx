// Unified dashboard with role-based content
'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Empty, Tag } from 'antd';
import {
  ShoppingOutlined,
  UserOutlined,
  SettingOutlined,
  HeartOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { DashboardLayout, DashboardGrid, StatCard } from '@/components/pmc-migrated/shared/DashboardLayout';
import { SellerDashboardOverview } from '@/components/pmc-migrated/seller/DashboardOverview';
import { SellerNav } from '@/components/pmc-migrated/seller/SellerNav';
import { userApi } from '@/lib/api/user';
import type { Order } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';
import { useRequireAuth, useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  useRequireAuth();
  const { user } = useAuth();

  // Render seller dashboard if user is a seller
  if (user?.role === 'seller') {
    return <SellerDashboard />;
  }

  // Render user dashboard for regular users
  return <UserDashboard />;
}

function SellerDashboard() {
  return (
    <DashboardLayout
      title="Seller Dashboard"
      subtitle="Manage your products, orders, and analytics"
      requireAuth
    >
      <SellerNav />
      <SellerDashboardOverview />
    </DashboardLayout>
  );
}

function UserDashboard() {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const ordersData = await userApi.getOrders({ limit: 5 });
        setRecentOrders(ordersData.orders);
      } catch (err) {
        handleError(err as Parameters<typeof handleError>[0], { showToast: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="My Dashboard" requireAuth>
        <LoadingState message="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Welcome, ${user?.name || 'User'}`}
      subtitle="Manage your account and orders"
      requireAuth
    >
      <div className="space-y-6">
        {/* Quick Links */}
        <DashboardGrid columns={4}>
          <Link href="/dashboard/orders">
            <Card hoverable className="rounded-2xl text-center">
              <ShoppingOutlined className="mb-2 text-3xl text-blue-500" />
              <h3 className="font-medium">My Orders</h3>
            </Card>
          </Link>
          <Link href="/dashboard/profile">
            <Card hoverable className="rounded-2xl text-center">
              <UserOutlined className="mb-2 text-3xl text-green-500" />
              <h3 className="font-medium">Profile</h3>
            </Card>
          </Link>
          <Link href="/dashboard/wishlist">
            <Card hoverable className="rounded-2xl text-center">
              <HeartOutlined className="mb-2 text-3xl text-red-500" />
              <h3 className="font-medium">Wishlist</h3>
            </Card>
          </Link>
          <Link href="/dashboard/settings">
            <Card hoverable className="rounded-2xl text-center">
              <SettingOutlined className="mb-2 text-3xl text-purple-500" />
              <h3 className="font-medium">Settings</h3>
            </Card>
          </Link>
        </DashboardGrid>

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
          {recentOrders.length === 0 ? (
            <Empty
              description="No orders yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Link href="/products">
                <Button type="primary">Start Shopping</Button>
              </Link>
            </Empty>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/dashboard/orders/${order.id}`}>
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                    <div>
                      <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} items • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Tag
                        color={
                          order.status === 'delivered'
                            ? 'green'
                            : order.status === 'shipped'
                            ? 'blue'
                            : order.status === 'cancelled'
                            ? 'red'
                            : 'orange'
                        }
                      >
                        {order.status}
                      </Tag>
                      <p className="mt-1 font-medium">
                        {order.currency} {order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Become a Seller CTA */}
        {user?.role !== 'seller' && (
          <Card className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Become a Seller</h3>
                <p className="mt-1 opacity-90">
                  Start selling your products to millions of customers
                </p>
              </div>
              <Link href="/become-seller">
                <Button size="large" className="bg-white text-blue-600">
                  Get Started
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
