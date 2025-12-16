'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import BlogGridCard from './BlogGridCard';
import { BlogPost } from '@/lib/api/blog';

interface RelatedPostsProps {
  title: string;
  subTitle?: string;
  posts?: BlogPost[];
}

export default function RelatedPosts({
  title,
  subTitle,
  posts,
}: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="related-posts-bg">
      <section className="related-posts-wrapper py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 md:gap-4 mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-xl mb-0">{title}</h3>
              {subTitle && (
                <div className="text-gray-500 text-sm mt-1">{subTitle}</div>
              )}
            </div>
          </div>
          <div className="swiper-container relative">
            <div className="swiper-inner overflow-hidden">
              <Swiper
                modules={[Navigation]}
                spaceBetween={24}
                slidesPerView={1}
                navigation={{
                  nextEl: '.custom-next-button',
                  prevEl: '.custom-prev-button',
                }}
                breakpoints={{
                  480: { slidesPerView: 1.5 },
                  768: { slidesPerView: 2.3 },
                  992: { slidesPerView: 3 },
                  1200: { slidesPerView: 4 },
                }}
              >
                {posts.map((post) => (
                  <SwiperSlide key={post.id} className="h-auto">
                    <BlogGridCard post={post} />
                  </SwiperSlide>
                ))}
                <button
                  className="custom-next-button absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight size={21} />
                </button>
                <button
                  className="custom-prev-button absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={21} />
                </button>
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
