// MIGRATION: Product grid from PMC
// VIPER: Visual consistency with Engine design system

'use client';

import React from 'react';
import { Pagination, Empty, Select } from 'antd';
import { ProductCard, ProductCardSkeleton } from './ProductCard';
import type { Product, Pagination as PaginationType } from '@/lib/api/types';

const { Option } = Select;

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  pagination?: PaginationType;
  onPageChange?: (page: number) => void;
  onSortChange?: (sort: string) => void;
  sortBy?: string;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  showSort?: boolean;
  showPagination?: boolean;
  columns?: 2 | 3 | 4;
  emptyText?: string;
}

/**
 * Product Grid Component
 * MIGRATION: Responsive grid layout for products
 */
export function ProductGrid({
  products,
  loading = false,
  pagination,
  onPageChange,
  onSortChange,
  sortBy = 'newest',
  onAddToCart,
  onAddToWishlist,
  showSort = true,
  showPagination = true,
  columns = 4,
  emptyText = 'No products found',
}: ProductGridProps) {
  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (loading) {
    return (
      <div className={`grid gap-6 ${gridClasses[columns]}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Empty
        description={emptyText}
        className="py-12"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with sort */}
      {showSort && (
        <div className="flex items-center justify-between">
          <p className="text-gray-500">
            {pagination
              ? `Showing ${(pagination.page - 1) * pagination.limit + 1}-${Math.min(
                  pagination.page * pagination.limit,
                  pagination.total
                )} of ${pagination.total} products`
              : `${products.length} products`}
          </p>
          <Select
            value={sortBy}
            onChange={onSortChange}
            className="w-44"
          >
            <Option value="newest">Newest First</Option>
            <Option value="price_asc">Price: Low to High</Option>
            <Option value="price_desc">Price: High to Low</Option>
            <Option value="rating">Best Rating</Option>
          </Select>
        </div>
      )}

      {/* Product Grid */}
      <div className={`grid gap-6 ${gridClasses[columns]}`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
          />
        ))}
      </div>

      {/* Pagination */}
      {showPagination && pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center pt-6">
          <Pagination
            current={pagination.page}
            total={pagination.total}
            pageSize={pagination.limit}
            onChange={onPageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
