// MIGRATION: ServicesCarousel component from manob.ai
// Uses Swiper for carousel, lucide-react icons
'use client';

import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import 'swiper/css';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ServiceCard } from '../service-card';
import { ServiceCardSkeleton } from './ServiceCardSkeleton';
import type { Service } from '@/lib/mocks/services.mock';
import styles from './ServicesCarousel.module.css';

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
  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h3 className={styles.title}>{title}</h3>
            {subTitle && <div className={styles.subTitle}>{subTitle}</div>}
          </div>
          <Link className={styles.headerLink} href={linkHref}>
            <span>{linkText}</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className={styles.swiperContainer}>
          <div className={styles.swiperInner}>
            <Swiper
              modules={[Navigation]}
              spaceBetween={16}
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
                    <ServiceCardSkeleton />
                  </SwiperSlide>
                ))}
              {!isLoading &&
                services?.map((item) => (
                  <SwiperSlide key={item.id} className={styles.slideAuto}>
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
              <button className={`${styles.navButton} ${styles.nextButton}`}>
                <ChevronRight size={21} />
              </button>
              <button className={`${styles.navButton} ${styles.prevButton}`}>
                <ChevronLeft size={21} />
              </button>
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
