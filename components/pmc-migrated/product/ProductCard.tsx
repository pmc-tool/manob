// MIGRATION: Product card from PMC
// VIPER: Visual consistency with Engine design system

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tag, Rate, Button } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import type { Product } from '@/lib/api/types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  showActions?: boolean;
}

/**
 * Product Card Component
 * MIGRATION: Reusable product card for grid displays
 */
export function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  showActions = true,
}: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToWishlist?.(product);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          {/* Status Badge */}
          {product.status !== 'active' && (
            <div className="absolute left-2 top-2">
              <Tag color={product.status === 'pending' ? 'orange' : 'red'}>
                {product.status.toUpperCase()}
              </Tag>
            </div>
          )}

          {/* Out of Stock Badge */}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-full bg-white px-4 py-2 font-medium text-gray-900">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick Actions */}
          {showActions && product.stock > 0 && (
            <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                className="flex-1"
              >
                Add to Cart
              </Button>
              <Button
                icon={<HeartOutlined />}
                onClick={handleAddToWishlist}
                title="Add to Wishlist"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <p className="mb-1 text-xs text-gray-500">{product.category.name}</p>
          )}

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 font-medium text-gray-900 group-hover:text-blue-600">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="mb-2 flex items-center gap-2">
            <Rate disabled defaultValue={product.rating} allowHalf className="text-sm" />
            <span className="text-sm text-gray-500">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-gray-900">
              {product.currency} {product.price.toFixed(2)}
            </p>
            {product.stock > 0 && product.stock < 10 && (
              <span className="text-xs text-orange-600">
                Only {product.stock} left
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Product Card Skeleton for loading states
 */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="aspect-square animate-pulse bg-gray-200" />
      <div className="p-4">
        <div className="mb-2 h-3 w-16 animate-pulse rounded bg-gray-200" />
        <div className="mb-2 h-5 w-full animate-pulse rounded bg-gray-200" />
        <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

export default ProductCard;
