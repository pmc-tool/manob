// MIGRATION: ProductCardGrid component from manob.ai
// Uses lucide-react icons, Tailwind CSS, with cart integration
'use client';

import { Zap, Tag, ShoppingCart, ExternalLink, Box, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ReviewStars } from '../review-stars';
import { Ribbon } from '../ribbon';
import useAddToCart from '@/hooks/useAddToCart';

interface Author {
  id?: string;
  email?: string;
  full_name?: string;
  is_online?: boolean;
  level?: string;
  profile_image?: string;
  user_name?: string;
  first_name?: string;
  last_name?: string;
}

interface ProductCardProps {
  id: string;
  img: string;
  author?: Author | string;
  category?: string;
  title: string;
  slug?: string;
  rating: number;
  reviews: number;
  price: number;
  discountPrice?: number;
  trendingStatus?: boolean;
  isOnSale?: boolean;
  sales: number;
  className?: string;
  is_liked?: boolean;
  loginUser?: string;
  isFreeProduct?: boolean;
  isPixiCompatible?: boolean;
  size?: 'default' | 'small';
}

export default function ProductCard({
  id,
  img,
  author,
  title,
  slug = '',
  rating,
  reviews,
  price,
  discountPrice = 0,
  trendingStatus,
  isOnSale,
  sales,
  className = '',
  isFreeProduct = false,
  isPixiCompatible = false,
  size = 'default',
}: ProductCardProps) {
  const { addToCart, isLoading, isInCart } = useAddToCart();
  const isSmall = size === 'small';

  // Handle author as either string or Author object
  const authorObj = typeof author === 'string' ? null : author;
  const authorName = typeof author === 'string'
    ? author
    : author?.full_name
      ? author.full_name
      : `${author?.first_name || ''} ${author?.last_name || ''}`.trim();
  const authorUsername = authorObj?.user_name || '';
  const inCart = isInCart(id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) return;
    await addToCart(id, { quantity: 1, lic_type: 'REGULAR' });
  };

  return (
    <div className={`group relative bg-white rounded-2xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-lg transition-shadow ${className}`}>
      <Link href={`/product-details/${slug}`} className="absolute inset-0 z-[1]" />

      {trendingStatus && (
        <Ribbon label="Trending" icon={<Zap size={16} />} variant="trending" />
      )}
      {isOnSale && (
        <Ribbon label="On Sale" icon={<Tag size={16} />} variant="sale" />
      )}
      {isPixiCompatible && (
        <Ribbon label="Pixi" icon={<Box size={14} />} variant="pixi" />
      )}

      <div className="relative overflow-hidden aspect-[16/10]">
        <Image
          src={img}
          alt={title}
          width={400}
          height={isSmall ? 120 : 200}
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110 group-hover:-rotate-1"
          style={{ height: isSmall ? '120px' : 'auto' }}
        />
      </div>

      <div className={`flex flex-col flex-1 ${isSmall ? 'p-2' : 'p-4'}`}>
        <div className={`italic text-black/50 mb-1 relative z-[2] ${isSmall ? 'text-xs' : 'text-sm'}`}>
          by{' '}
          <Link href={`/${authorUsername}`} className="not-italic font-medium text-inherit no-underline hover:text-primary">
            {authorName}
          </Link>
        </div>

        <h5 className={`font-semibold line-clamp-2 relative z-[2] ${isSmall ? 'text-sm mb-1' : 'text-[17px] mb-2'}`}>
          <Link
            href={`/product-details/${slug}`}
            className="text-inherit no-underline bg-gradient-to-r from-transparent to-transparent bg-[length:0%_100%] bg-no-repeat hover:bg-[length:100%_100%] transition-[background-size] duration-500"
            style={{ backgroundImage: 'linear-gradient(transparent calc(100% - 2px), #ea2725 2px)' }}
          >
            {title}
          </Link>
        </h5>

        {rating > 0 && reviews > 0 && (
          <ReviewStars
            rating={rating}
            reviewCount={reviews}
            className={isSmall ? 'text-xs' : ''}
            size={isSmall ? 10 : 13.5}
          />
        )}

        <div className="mt-auto">
          <hr className={`border-t border-gray-200 ${isSmall ? 'my-2' : 'my-3'}`} />
          <div className="flex justify-between items-center">
            <div className="text-left">
              {discountPrice || isFreeProduct ? (
                <div className="flex items-center gap-1.5">
                  <span className={`text-gray-500 line-through ${isSmall ? 'text-xs' : 'text-lg'}`}>
                    ${price}
                  </span>
                  <span className={`font-semibold text-green-600 ${isSmall ? 'text-base' : 'text-[23px]'}`}>
                    ${discountPrice}
                  </span>
                </div>
              ) : (
                <span className={`font-semibold text-gray-900 ${isSmall ? 'text-base' : 'text-[23px]'}`}>
                  ${price}
                </span>
              )}
              <div className="text-[9px] uppercase font-semibold text-gray-500 mt-0.5">{sales} Sales</div>
            </div>

            <div className="flex gap-2 relative z-[2]">
              <button
                className={`flex items-center justify-center p-0 bg-transparent border border-gray-200 rounded-lg cursor-pointer transition-all text-gray-900 hover:border-primary hover:text-primary disabled:opacity-70 disabled:cursor-not-allowed ${
                  inCart ? 'bg-green-600 border-green-600 text-white cursor-default' : ''
                } ${isSmall ? 'w-7 h-7' : 'w-9 h-9'}`}
                title={inCart ? 'In Cart' : 'Add to Cart'}
                onClick={handleAddToCart}
                disabled={isLoading || inCart}
              >
                {isLoading ? (
                  <Loader2 size={isSmall ? 14 : 18} className="animate-spin" />
                ) : (
                  <ShoppingCart size={isSmall ? 14 : 18} />
                )}
              </button>
              <Link
                href={`/product-preview/${id}`}
                target="_blank"
                className={`flex items-center gap-1.5 font-medium bg-transparent border border-gray-200 rounded-lg text-gray-900 no-underline transition-all hover:border-primary hover:text-primary ${
                  isSmall ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'
                }`}
              >
                <ExternalLink size={isSmall ? 12 : 14} />
                <span>Preview</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
