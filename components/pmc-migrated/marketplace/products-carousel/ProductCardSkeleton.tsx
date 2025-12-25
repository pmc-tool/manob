// MIGRATION: ProductCardSkeleton component for loading state
'use client';

import { Skeleton } from 'antd';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col shadow-sm">
      <div className="aspect-[16/10] bg-gray-200 animate-pulse" />
      <div className="p-4 flex flex-col flex-1">
        <Skeleton active paragraph={{ rows: 3 }} />
      </div>
    </div>
  );
}
