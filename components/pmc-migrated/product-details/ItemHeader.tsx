// Item Header component for product details (matching original PMC design)
'use client';

import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';

interface ItemHeaderProps {
  title: string;
  authorName: string;
  authorId?: string;
  salesNumber?: number;
  viewsNumber?: number;
}

export default function ItemHeader({
  title,
  authorName,
  authorId,
  salesNumber = 0,
  viewsNumber = 0,
}: ItemHeaderProps) {
  return (
    <div className="mb-4">
      <div className="relative">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">{title}</h1>
        <div className="flex items-center flex-wrap gap-2">
          <div>
            <span className="italic mr-2 text-gray-600">By</span>
            <Link
              href={`/${authorId}`}
              className="text-primary font-semibold hover:underline"
            >
              {authorName}
            </Link>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
            <span className="font-bold">{salesNumber.toLocaleString()}</span>
            <span className="text-gray-600 ml-1">sales</span>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Eye className="h-5 w-5 text-gray-600" />
            <span className="font-bold">{viewsNumber.toLocaleString()}</span>
            <span className="text-gray-600 ml-1">Views</span>
          </div>
        </div>
      </div>
    </div>
  );
}
