// MIGRATION: ServiceCardGrid component from manob.ai
// Uses lucide-react icons, CSS Modules
'use client';

import { Zap, Tag, Box } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ReviewStars } from '../review-stars';
import { Ribbon } from '../ribbon';
import styles from './ServiceCard.module.css';

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
  authorName: string;
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
  authorName,
  price,
  discountPrice = 0,
  trendingStatus,
  isOnSale,
  isPixiCompatible = false,
}: ServiceCardProps) {
  return (
    <div className={styles.serviceCard}>
      <Link href={`/service-details/${slug}`} className={styles.stretchedLink} />

      {trendingStatus && (
        <Ribbon label="Trending" icon={<Zap size={16} />} variant="trending" />
      )}
      {isOnSale && (
        <Ribbon label="On Sale" icon={<Tag size={16} />} variant="sale" />
      )}
      {isPixiCompatible && (
        <Ribbon label="Pixi" icon={<Box size={14} />} variant="pixi" />
      )}

      <div className={styles.imageWrapper}>
        <Image
          src={img}
          alt={title}
          width={400}
          height={200}
          className={styles.serviceImage}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.metaLine}>
          {author && (
            <>
              by{' '}
              <Link href={authorProfileLink} className={styles.authorLink}>
                {author}
              </Link>{' '}
            </>
          )}
          {category && (
            <>
              in{' '}
              <Link href={`/category/services/${categoryId}`} className={styles.categoryLink}>
                {category}
              </Link>
            </>
          )}
        </div>

        <h5 className={styles.title}>
          <Link href={`/service-details/${slug}`}>{title}</Link>
        </h5>

        {rating > 0 && reviews > 0 && (
          <ReviewStars rating={rating} reviewCount={reviews} size={13.5} />
        )}

        <div className={styles.footer}>
          <hr className={styles.divider} />
          <div className={styles.footerContent}>
            <Link href={authorProfileLink} className={styles.authorAvatar}>
              {authorImg ? (
                <Image
                  src={authorImg}
                  alt={authorName}
                  width={30}
                  height={30}
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {authorName.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
            <Link href={authorProfileLink} className={styles.authorName}>
              {authorName}
            </Link>

            <div className={styles.priceSection}>
              <span className={styles.fromLabel}>From</span>
              {discountPrice ? (
                <div className={styles.priceWithDiscount}>
                  <span className={styles.originalPrice}>${price}</span>
                  <span className={styles.discountPrice}>${discountPrice}</span>
                </div>
              ) : (
                <span className={styles.price}>${price}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
