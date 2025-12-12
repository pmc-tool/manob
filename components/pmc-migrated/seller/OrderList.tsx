// MIGRATION: Seller order list from PMC
// VIPER: Visual consistency with Engine design system
// CONTRACT: Uses sellerApi for data fetching

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Tag, Space, Input, Select, Modal, message, Form } from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  TruckOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { sellerApi } from '@/lib/api/seller';
import type { Order, OrderListResponse } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { ErrorDisplay } from '@/components/pmc-migrated/shared/ErrorBoundary';

const { Option } = Select;

interface SellerOrderListProps {
  initialData?: OrderListResponse;
  defaultStatus?: string;
}

/**
 * Seller Order List Component
 * MIGRATION: Order management table with status updates
 */
export function SellerOrderList({ initialData, defaultStatus }: SellerOrderListProps) {
  const [orders, setOrders] = useState<Order[]>(initialData?.orders || []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<ReturnType<typeof handleError> | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: initialData?.pagination.total || 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    status: defaultStatus || '',
  });
  const [shipModal, setShipModal] = useState<{ visible: boolean; orderId: string | null }>({
    visible: false,
    orderId: null,
  });
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sellerApi.getOrders({
        page: pagination.current,
        limit: pagination.pageSize,
        status: filters.status || undefined,
      });
      setOrders(data.orders);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination.total,
      }));
    } catch (err) {
      const displayError = handleError(err as Parameters<typeof handleError>[0]);
      setError(displayError);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, filters.status]);

  useEffect(() => {
    if (!initialData) {
      fetchOrders();
    }
  }, [fetchOrders, initialData]);

  const handleStatusUpdate = async (
    orderId: string,
    status: 'confirmed' | 'processing' | 'shipped' | 'delivered',
    trackingNum?: string
  ) => {
    try {
      setUpdating(true);
      await sellerApi.updateOrderStatus(orderId, status, trackingNum);
      message.success(`Order ${status}`);
      setShipModal({ visible: false, orderId: null });
      setTrackingNumber('');
      fetchOrders();
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusActions = (order: Order) => {
    switch (order.status) {
      case 'pending':
        return (
          <Button
            type="primary"
            size="small"
            icon={<CheckOutlined />}
            onClick={() => handleStatusUpdate(order.id, 'confirmed')}
          >
            Confirm
          </Button>
        );
      case 'confirmed':
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => handleStatusUpdate(order.id, 'processing')}
          >
            Start Processing
          </Button>
        );
      case 'processing':
        return (
          <Button
            type="primary"
            size="small"
            icon={<TruckOutlined />}
            onClick={() => setShipModal({ visible: true, orderId: order.id })}
          >
            Ship Order
          </Button>
        );
      case 'shipped':
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => handleStatusUpdate(order.id, 'delivered')}
          >
            Mark Delivered
          </Button>
        );
      default:
        return null;
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Link
          href={`/dashboard/orders/${id}`}
          className="font-mono text-blue-600 hover:underline"
        >
          #{id.slice(0, 8)}
        </Link>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_: unknown, record: Order) => (
        <div>
          <p className="font-medium">{record.shippingAddress.name}</p>
          <p className="text-sm text-gray-500">{record.shippingAddress.city}</p>
        </div>
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
      render: (total: number, record: Order) => (
        <span className="font-medium">
          {record.currency} {total.toFixed(2)}
        </span>
      ),
      sorter: true,
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
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Confirmed', value: 'confirmed' },
        { text: 'Processing', value: 'processing' },
        { text: 'Shipped', value: 'shipped' },
        { text: 'Delivered', value: 'delivered' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: Order['paymentStatus']) => {
        const colors: Record<Order['paymentStatus'], string> = {
          pending: 'orange',
          paid: 'green',
          failed: 'red',
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
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Order) => (
        <Space size="small">
          <Link href={`/dashboard/orders/${record.id}`}>
            <Button type="text" icon={<EyeOutlined />} title="View Details" />
          </Link>
          {getStatusActions(record)}
        </Space>
      ),
    },
  ];

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchOrders} showRetry />;
  }

  // Filter orders locally for search
  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(filters.search.toLowerCase()) ||
    o.shippingAddress.name.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search orders..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="w-64"
          allowClear
        />
        <Select
          placeholder="Filter by status"
          value={filters.status || undefined}
          onChange={(value) => setFilters((f) => ({ ...f, status: value || '' }))}
          className="w-40"
          allowClear
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
        dataSource={filteredOrders}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} orders`,
          onChange: (page, pageSize) => {
            setPagination((prev) => ({
              ...prev,
              current: page,
              pageSize: pageSize || 10,
            }));
          },
        }}
        className="rounded-2xl border border-gray-200 bg-white"
      />

      {/* Ship Order Modal */}
      <Modal
        title="Ship Order"
        open={shipModal.visible}
        onOk={() => {
          if (shipModal.orderId) {
            handleStatusUpdate(shipModal.orderId, 'shipped', trackingNumber);
          }
        }}
        onCancel={() => {
          setShipModal({ visible: false, orderId: null });
          setTrackingNumber('');
        }}
        confirmLoading={updating}
        okText="Ship Order"
      >
        <Form layout="vertical">
          <Form.Item label="Tracking Number (Optional)">
            <Input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default SellerOrderList;
