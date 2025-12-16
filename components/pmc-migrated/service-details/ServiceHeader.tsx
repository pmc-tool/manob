// Service Header component (matching original PMC design)
'use client';

import Link from 'next/link';
import { Star, Eye, ShoppingBag, Clock } from 'lucide-react';

interface ServiceHeaderProps {
  title: string;
  category: string;
  categoryId: string;
  subcategory?: string;
  sellerName: string;
  sellerUsername: string;
  avgRating: number;
  totalReviews: number;
  totalOrders: number;
  totalViews: number;
  responseTime: string;
}

export default function ServiceHeader({
  title,
  category,
  categoryId,
  subcategory,
  sellerName,
  sellerUsername,
  avgRating,
  totalReviews,
  totalOrders,
  totalViews,
  responseTime,
}: ServiceHeaderProps) {
  return (
    <div className="service-header mb-4">
      {/* Breadcrumb */}
      <nav className="breadcrumb-nav mb-3">
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          <li>
            <Link href="/service-list" className="hover:text-primary">
              Services
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link href={`/category/services/${categoryId}`} className="hover:text-primary">
              {category}
            </Link>
          </li>
          {subcategory && (
            <>
              <li className="text-gray-400">/</li>
              <li className="text-gray-500">{subcategory}</li>
            </>
          )}
        </ol>
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-3 leading-tight">{title}</h1>

      {/* Seller & Stats */}
      <div className="service-meta-stats flex flex-wrap items-center gap-4 mb-4">
        {/* Seller */}
        <div className="stat-item">
          <Link href={`/${sellerUsername}`} className="text-primary font-medium hover:underline">
            {sellerName}
          </Link>
        </div>

        {/* Rating */}
        <div className="stat-item inline-flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
          <span className="font-semibold">{avgRating.toFixed(1)}</span>
          <span className="text-gray-500">({totalReviews} reviews)</span>
        </div>

        {/* Orders */}
        <div className="stat-item inline-flex items-center gap-1 text-gray-600">
          <ShoppingBag className="h-4 w-4 flex-shrink-0" />
          <span>{totalOrders} orders</span>
        </div>

        {/* Views */}
        <div className="stat-item inline-flex items-center gap-1 text-gray-600">
          <Eye className="h-4 w-4 flex-shrink-0" />
          <span>{totalViews.toLocaleString()} views</span>
        </div>

        {/* Response Time */}
        <div className="stat-item inline-flex items-center gap-1 text-gray-600">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span>Responds in {responseTime}</span>
        </div>
      </div>
    </div>
  );
}
