// MIGRATION: ServiceCardGrid component from manob.ai
// Uses lucide-react icons, Tailwind CSS
'use client';

import { Zap, Tag, Box } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ReviewStars } from '../review-stars';
import { Ribbon } from '../ribbon';

interface ServiceCardProps {
  id: string;
  slug?: string;
  img: string;
  author?: string;
  authorProfileLink?: string;
  category?: string;
  categoryId?: string;
  title: string;
  rating: number;
  reviews: number;
  authorImg?: string;
  authorName?: string;
  price: number;
  discountPrice?: number;
  trendingStatus?: boolean;
  isOnSale?: boolean;
  isPixiCompatible?: boolean;
  is_liked?: boolean;
}

export default function ServiceCard({
  id,
  slug = '',
  img,
  author,
  authorProfileLink = '#',
  category,
  categoryId,
  title,
  rating,
  reviews,
  authorImg,
  authorName = '',
  price,
  discountPrice = 0,
  trendingStatus,
  isOnSale,
  isPixiCompatible = false,
}: ServiceCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-lg transition-shadow">
      <Link href={`/service-details/${slug}`} className="absolute inset-0 z-[1]" />

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
          height={200}
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110 group-hover:-rotate-1"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      <div className="flex flex-col flex-1 p-4">
        <div className="italic text-sm text-black/50 mb-1 relative z-[2]">
          {author && (
            <>
              by{' '}
              <Link href={authorProfileLink} className="not-italic font-medium text-inherit no-underline hover:text-primary">
                {author}
              </Link>{' '}
            </>
          )}
          {category && (
            <>
              in{' '}
              <Link href={`/category/services/${categoryId}`} className="not-italic font-medium text-inherit no-underline hover:text-primary">
                {category}
              </Link>
            </>
          )}
        </div>

        <h5 className="text-[17px] font-semibold mb-2 line-clamp-2 relative z-[2]">
          <Link
            href={`/service-details/${slug}`}
            className="text-inherit no-underline bg-gradient-to-r from-transparent to-transparent bg-[length:0%_100%] bg-no-repeat hover:bg-[length:100%_100%] transition-[background-size] duration-500"
            style={{ backgroundImage: 'linear-gradient(transparent calc(100% - 2px), #ea2725 2px)' }}
          >
            {title}
          </Link>
        </h5>

        {rating > 0 && reviews > 0 && (
          <ReviewStars rating={rating} reviewCount={reviews} size={13.5} />
        )}

        <div className="mt-auto">
          <hr className="border-t border-gray-200 my-3" />
          <div className="flex items-center gap-2 relative z-[2]">
            <Link href={authorProfileLink} className="flex-shrink-0">
              {authorImg ? (
                <Image
                  src={authorImg}
                  alt={authorName}
                  width={30}
                  height={30}
                  className="w-[30px] h-[30px] rounded-full object-cover"
                />
              ) : (
                <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                  {authorName.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
            <Link href={authorProfileLink} className="font-medium text-sm text-gray-900 no-underline whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px] hover:text-primary">
              {authorName}
            </Link>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[9px] uppercase font-semibold text-gray-500">From</span>
              {discountPrice ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-lg text-gray-500 line-through">${price}</span>
                  <span className="text-[23px] font-semibold text-green-600">${discountPrice}</span>
                </div>
              ) : (
                <span className="text-[23px] font-semibold text-gray-900">${price}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
