// MIGRATION: Seller product list from PMC
// VIPER: Visual consistency with Engine design system
// CONTRACT: Uses sellerApi for data fetching

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Tag, Space, Input, Select, Popconfirm, message } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import { sellerApi } from '@/lib/api/seller';
import type { Product, ProductListResponse } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';
import { ErrorDisplay } from '@/components/pmc-migrated/shared/ErrorBoundary';

const { Option } = Select;

interface SellerProductListProps {
  initialData?: ProductListResponse;
}

/**
 * Seller Product List Component
 * MIGRATION: Product management table with CRUD operations
 */
export function SellerProductList({ initialData }: SellerProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialData?.products || []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<ReturnType<typeof handleError> | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: initialData?.pagination.total || 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '' as string,
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sellerApi.getProducts({
        page: pagination.current,
        limit: pagination.pageSize,
        status: filters.status || undefined,
      });
      setProducts(data.products);
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
      fetchProducts();
    }
  }, [fetchProducts, initialData]);

  const handleDelete = async (id: string) => {
    try {
      await sellerApi.deleteProduct(id);
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    }
  };

  const handleStatusChange = async (id: string, status: 'active' | 'inactive') => {
    try {
      await sellerApi.updateProductStatus(id, status);
      message.success(`Product ${status === 'active' ? 'activated' : 'deactivated'}`);
      fetchProducts();
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    }
  };

  const columns = [
    {
      title: 'Product',
      key: 'product',
      render: (_: unknown, record: Product) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
            {record.thumbnail ? (
              <Image
                src={record.thumbnail}
                alt={record.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                <EyeOutlined />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{record.title}</p>
            <p className="text-sm text-gray-500">{record.category?.name}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: Product) =>
        `${record.currency} ${price.toFixed(2)}`,
      sorter: true,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <span className={stock < 10 ? 'text-red-600 font-medium' : ''}>
          {stock}
        </span>
      ),
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Product['status']) => {
        const colors: Record<Product['status'], string> = {
          active: 'green',
          inactive: 'default',
          pending: 'orange',
          rejected: 'red',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number, record: Product) => (
        <span>
          ★ {rating.toFixed(1)} ({record.reviewCount})
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Product) => (
        <Space size="small">
          <Link href={`/dashboard/products/${record.id}`}>
            <Button type="text" icon={<EyeOutlined />} title="View" />
          </Link>
          <Link href={`/dashboard/products/${record.id}/edit`}>
            <Button type="text" icon={<EditOutlined />} title="Edit" />
          </Link>
          {record.status === 'active' ? (
            <Popconfirm
              title="Deactivate this product?"
              onConfirm={() => handleStatusChange(record.id, 'inactive')}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" danger title="Deactivate">
                Deactivate
              </Button>
            </Popconfirm>
          ) : (
            <Button
              type="text"
              onClick={() => handleStatusChange(record.id, 'active')}
              title="Activate"
            >
              Activate
            </Button>
          )}
          <Popconfirm
            title="Delete this product?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
          >
            <Button type="text" danger icon={<DeleteOutlined />} title="Delete" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <ErrorDisplay error={error} onRetry={fetchProducts} showRetry />
    );
  }

  // Filter products locally for search
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search products..."
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
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="pending">Pending</Option>
          </Select>
        </div>
        <Link href="/dashboard/products/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Add Product
          </Button>
        </Link>
      </div>

      {/* Products Table */}
      <Table
        dataSource={filteredProducts}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} products`,
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
    </div>
  );
}

export default SellerProductList;
