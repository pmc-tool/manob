// Related Products Carousel component (matching original PMC design)
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight, Star, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/mocks/product-details.mock';

interface RelatedProduct {
  id: string;
  title: string;
  thumbnail_image: string;
  price: number;
  total_sales: number;
  avg_rating: number;
  total_reviews: number;
  creator: {
    first_name: string;
    last_name: string;
    user_name: string;
  };
}

interface RelatedProductsCarouselProps {
  title: string;
  description?: string;
  linkHref: string;
  linkText: string;
  products: RelatedProduct[];
  isLoading?: boolean;
}

function ProductCard({ product }: { product: RelatedProduct }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex-shrink-0 w-[280px] sm:w-[300px]">
      <Link href={`/product-details/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.thumbnail_image}
            alt={product.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </div>
      </Link>
      <div className="p-4">
        <Link
          href={`/product-details/${product.id}`}
          className="font-semibold text-gray-900 hover:text-primary line-clamp-2 mb-2 block text-[15px]"
        >
          {product.title}
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.avg_rating.toFixed(1)}</span>
          </div>
          <span className="text-[13px] text-gray-400">({product.total_reviews} reviews)</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <ShoppingCart className="h-4 w-4" />
          <span>{product.total_sales.toLocaleString()} sales</span>
        </div>
        <div className="flex items-center justify-between">
          <Link href={`/${product.creator.user_name}`} className="text-[13px] text-gray-500 hover:text-primary">
            by {product.creator.first_name} {product.creator.last_name}
          </Link>
          <span className="text-lg font-bold text-primary">${formatPrice(product.price)}</span>
        </div>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex-shrink-0 w-[280px] sm:w-[300px] animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-5 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export default function RelatedProductsCarousel({
  title,
  description,
  linkHref,
  linkText,
  products,
  isLoading = false,
}: RelatedProductsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollability, 300);
    }
  };

  return (
    <section className="py-8 bg-[#f8f8f8]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-6">
          <div className="flex-grow">
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && <p className="text-gray-500 text-sm">{description}</p>}
          </div>
          <Link href={linkHref} className="text-primary font-semibold flex items-center gap-1 hover:underline text-sm">
            {linkText}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 -ml-4"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 -mr-4"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Products Scroll Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollability}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)
              : products?.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
