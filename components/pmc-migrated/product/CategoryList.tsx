// MIGRATION: Category list from PMC
// VIPER: Visual consistency with Engine design system

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, Badge } from 'antd';
import { RightOutlined, FolderOutlined } from '@ant-design/icons';
import type { Category } from '@/lib/api/types';

interface CategoryListProps {
  categories: Category[];
  layout?: 'grid' | 'list';
  showCounts?: boolean;
}

/**
 * Category List Component
 * MIGRATION: Display categories in grid or list layout
 */
export function CategoryList({
  categories,
  layout = 'grid',
  showCounts = true,
}: CategoryListProps) {
  if (layout === 'list') {
    return (
      <div className="space-y-2">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-400 hover:shadow-md">
              <div className="flex items-center gap-3">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                    <FolderOutlined className="text-xl text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {showCounts && (
                  <span className="text-sm text-gray-500">
                    {category.productCount} products
                  </span>
                )}
                <RightOutlined className="text-gray-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.slug}`}>
          <Card
            hoverable
            className="overflow-hidden rounded-mdxl text-center"
            cover={
              category.image ? (
                <div className="relative h-32 bg-gray-100">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                  <FolderOutlined className="text-4xl text-blue-400" />
                </div>
              )
            }
            bodyStyle={{ padding: '12px' }}
          >
            <h3 className="font-medium text-gray-900 line-clamp-1">
              {category.name}
            </h3>
            {showCounts && (
              <p className="text-sm text-gray-500">
                {category.productCount} products
              </p>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
}

/**
 * Category Card Component for featured display
 */
export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <div className="group relative overflow-hidden rounded-mdxl">
        <div className="relative aspect-[4/3]">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
              <FolderOutlined className="text-6xl text-white/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-bold">{category.name}</h3>
          <p className="text-sm text-white/80">
            {category.productCount} products
          </p>
        </div>
      </div>
    </Link>
  );
}

/**
 * Category Tree Component for nested display
 */
export function CategoryTree({
  categories,
  level = 0,
}: {
  categories: Category[];
  level?: number;
}) {
  return (
    <ul className={level === 0 ? 'space-y-1' : 'ml-4 mt-1 space-y-1'}>
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={`/categories/${category.slug}`}
            className={`block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100 ${
              level === 0 ? 'font-medium' : 'text-gray-600'
            }`}
          >
            <span className="flex items-center justify-between">
              {category.name}
              <Badge count={category.productCount} showZero={false} />
            </span>
          </Link>
          {category.children && category.children.length > 0 && (
            <CategoryTree categories={category.children} level={level + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default CategoryList;
