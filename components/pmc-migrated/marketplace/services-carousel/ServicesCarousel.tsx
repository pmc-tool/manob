// MIGRATION: ServicesCarousel component from manob.ai
// Uses Swiper for carousel, lucide-react icons
'use client';

import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useId } from 'react';
import 'swiper/css';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ServiceCard } from '../service-card';
import { ServiceCardSkeleton } from './ServiceCardSkeleton';
import type { Service } from '@/lib/mocks/services.mock';

type ServicesCarouselProps = {
  title: string;
  subTitle?: string;
  linkHref: string;
  linkText: string;
  services: Service[];
  isLoading?: boolean;
};

export default function ServicesCarousel({
  title,
  subTitle,
  linkHref,
  linkText,
  services,
  isLoading = false,
}: ServicesCarouselProps) {
  const id = useId().replace(/:/g, '');
  const nextBtnId = `svc-next-${id}`;
  const prevBtnId = `svc-prev-${id}`;

  return (
    <section className="pt-0">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <div>
            <h3 className="text-xl font-semibold m-0 text-gray-900">{title}</h3>
            {subTitle && <div className="text-sm text-gray-500 mt-1">{subTitle}</div>}
          </div>
          <Link className="flex items-center gap-2 font-semibold text-primary no-underline transition-opacity hover:opacity-80" href={linkHref}>
            <span>{linkText}</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <Swiper
              modules={[Navigation]}
              spaceBetween={16}
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
                    <ServiceCardSkeleton />
                  </SwiperSlide>
                ))}
              {!isLoading &&
                services?.map((item) => (
                  <SwiperSlide key={item.id} className="h-auto">
                    <ServiceCard
                      id={item.id}
                      slug={item.slug}
                      img={item.thumbnail_image}
                      author={item.creator?.full_name}
                      authorProfileLink={`/${item.creator?.user_name}`}
                      category={item.category}
                      categoryId={item.category_id}
                      title={item.title}
                      rating={item.avg_rating}
                      reviews={item.total_reviews}
                      authorImg={item.creator?.profile_image}
                      authorName={item.creator?.full_name}
                      price={item.price}
                      discountPrice={item.mrp && item.mrp < item.price ? item.mrp : 0}
                      isOnSale={item.is_onsale}
                      trendingStatus={item.is_trending}
                      is_liked={item.is_liked}
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
      </div>
    </section>
  );
}
