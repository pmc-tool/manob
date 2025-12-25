// MIGRATION: ProductsCarousel component from manob.ai
// Uses Swiper for carousel, lucide-react icons
'use client';

import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useId } from 'react';
import 'swiper/css';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ProductCard } from '../product-card';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import type { Product } from '@/lib/mocks/products.mock';

type ProductsCarouselProps = {
  title: string;
  linkHref: string;
  linkText: string;
  products: Product[];
  isLoading?: boolean;
  loginUserName?: string;
};

export default function ProductsCarousel({
  title,
  linkHref,
  linkText,
  products,
  isLoading = false,
  loginUserName = '',
}: ProductsCarouselProps) {
  const id = useId().replace(/:/g, '');
  const nextBtnId = `next-${id}`;
  const prevBtnId = `prev-${id}`;

  return (
    <section className="pt-0">
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <h3 className="text-xl font-semibold m-0 text-gray-900">{title}</h3>
        <Link className="flex items-center gap-2 font-semibold text-primary no-underline transition-opacity hover:opacity-80" href={linkHref}>
          <span>{linkText}</span>
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              nextEl: `#${nextBtnId}`,
              prevEl: `#${prevBtnId}`,
            }}
            breakpoints={{
              480: { slidesPerView: 1.5 },
              768: { slidesPerView: 2.3 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
          >
            {isLoading &&
              [...Array(10)].map((_, index) => (
                <SwiperSlide key={index}>
                  <ProductCardSkeleton />
                </SwiperSlide>
              ))}
            {!isLoading &&
              products?.map((item) => (
                <SwiperSlide key={item.id} className="h-auto">
                  <ProductCard
                    id={item.id}
                    img={item.thumbnail_image}
                    author={item.creator}
                    title={item.title}
                    rating={item.avg_rating}
                    reviews={item.total_reviews}
                    price={item.price}
                    slug={item.slug}
                    discountPrice={item.mrp && item.mrp < item.price ? item.mrp : 0}
                    isOnSale={item.is_onsale}
                    trendingStatus={item.is_trending}
                    sales={item.total_sales}
                    is_liked={item.is_liked}
                    loginUser={loginUserName}
                    isFreeProduct={item.mrp === 0}
                  />
                </SwiperSlide>
              ))}
            <button
              id={nextBtnId}
              className="absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md cursor-pointer flex items-center justify-center transition-all text-gray-900 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed right-0 md:-right-5"
            >
              <ChevronRight size={21} />
            </button>
            <button
              id={prevBtnId}
              className="absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md cursor-pointer flex items-center justify-center transition-all text-gray-900 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed left-0 md:-left-5"
            >
              <ChevronLeft size={21} />
            </button>
          </Swiper>
        </div>
      </div>
    </section>
  );
}
