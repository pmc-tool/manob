// Related Services Carousel component (matching original PMC design)
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useRef } from 'react';

interface RelatedService {
  id: string;
  slug: string;
  title: string;
  img: string;
  authorName: string;
  price: number;
  rating: number;
  reviews: number;
}

interface RelatedServicesCarouselProps {
  title: string;
  linkHref: string;
  linkText: string;
  services: RelatedService[];
}

export default function RelatedServicesCarousel({
  title,
  linkHref,
  linkText,
  services,
}: RelatedServicesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section className="related-services py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">{title}</h3>
          <div className="flex items-center gap-3">
            <Link href={linkHref} className="text-primary font-medium text-sm hover:underline">
              {linkText}
            </Link>
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="custom-prev-button w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="custom-next-button w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {services.map((service) => (
            <div
              key={service.id}
              className="flex-shrink-0 w-72 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
              style={{ scrollSnapAlign: 'start' }}
            >
              <Link href={`/service-details/${service.slug}`}>
                <div className="relative h-40">
                  <Image
                    src={service.img}
                    alt={service.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link
                  href={`/service-details/${service.slug}`}
                  className="block font-medium text-[15px] text-gray-800 hover:text-primary line-clamp-2 mb-2"
                >
                  {service.title}
                </Link>
                <p className="text-gray-500 text-[13px] mb-2">by {service.authorName}</p>

                {service.rating > 0 && (
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-[13px]">{service.rating.toFixed(1)}</span>
                    <span className="text-gray-400 text-[13px]">({service.reviews})</span>
                  </div>
                )}

                <div className="flex items-center justify-between border-t pt-3 mt-2">
                  <span className="text-gray-500 text-[13px]">Starting at</span>
                  <span className="text-primary font-bold text-base">${service.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
