// MIGRATION: ProductsCarousel component from PackMyCode
// Uses Swiper for carousel, lucide-react icons
'use client';

import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import 'swiper/css';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ProductCard } from '../product-card';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import type { Product } from '@/lib/mocks/products.mock';
import styles from './ProductsCarousel.module.css';

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
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <Link className={styles.headerLink} href={linkHref}>
          <span>{linkText}</span>
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className={styles.swiperContainer}>
        <div className={styles.swiperInner}>
          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              nextEl: `.${styles.nextButton}`,
              prevEl: `.${styles.prevButton}`,
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
                <SwiperSlide key={item.id} className={styles.slideAuto}>
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
            <button className={`${styles.navButton} ${styles.nextButton}`}>
              <ChevronRight size={21} />
            </button>
            <button className={`${styles.navButton} ${styles.prevButton}`}>
              <ChevronLeft size={21} />
            </button>
          </Swiper>
        </div>
      </div>
    </section>
  );
}
