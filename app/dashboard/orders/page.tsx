// Unified orders page with role-based content
'use client';

import { useState, useEffect } from 'react';
import { Table, Tag, Select, Empty } from 'antd';
import Link from 'next/link';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { SellerOrderList } from '@/components/pmc-migrated/seller/OrderList';
import { SellerNav } from '@/components/pmc-migrated/seller/SellerNav';
import { userApi } from '@/lib/api/user';
import type { Order, Pagination } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { useRequireAuth, useAuth } from '@/context/AuthContext';

const { Option } = Select;

export default function OrdersPage() {
  useRequireAuth();
  const { user } = useAuth();

  // Render seller orders if user is a seller
  if (user?.role === 'seller') {
    return <SellerOrders />;
  }

  // Render user orders for regular users
  return <UserOrders />;
}

function SellerOrders() {
  return (
    <DashboardLayout
      title="Orders"
      subtitle="Manage customer orders"
      requireAuth
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Orders' },
      ]}
    >
      <SellerNav />
      <SellerOrderList />
    </DashboardLayout>
  );
}

function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | undefined>();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await userApi.getOrders({
          page,
          limit: 10,
          status: statusFilter || undefined,
        });
        setOrders(data.orders);
        setPagination(data.pagination);
      } catch (err) {
        handleError(err as Parameters<typeof handleError>[0], { showToast: true });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, statusFilter]);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Link href={`/dashboard/orders/${id}`} className="text-blue-600 hover:underline">
          #{id.slice(0, 8)}
        </Link>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items: Order['items']) => `${items.length} item(s)`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number, record: Order) =>
        `${record.currency} ${total.toFixed(2)}`,
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
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <DashboardLayout
      title="My Orders"
      subtitle="View and track your orders"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Orders' },
      ]}
      requireAuth
    >
      <div className="space-y-4">
        {/* Filter */}
        <div className="flex justify-end">
          <Select
            placeholder="Filter by status"
            value={statusFilter || undefined}
            onChange={setStatusFilter}
            allowClear
            className="w-40"
          >
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="processing">Processing</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </div>

        {/* Orders Table */}
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={
            pagination
              ? {
                  current: pagination.page,
                  total: pagination.total,
                  pageSize: pagination.limit,
                  onChange: setPage,
                  showTotal: (total) => `Total ${total} orders`,
                }
              : false
          }
          locale={{
            emptyText: <Empty description="No orders found" />,
          }}
          className="rounded-2xl border border-gray-200 bg-white"
        />
      </div>
    </DashboardLayout>
  );
}
