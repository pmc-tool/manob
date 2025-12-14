// MIGRATION: ProductCardGrid component from manob.ai
// Uses lucide-react icons, CSS Modules, with cart integration
'use client';

import { Zap, Tag, ShoppingCart, ExternalLink, Box, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ReviewStars } from '../review-stars';
import { Ribbon } from '../ribbon';
import useAddToCart from '@/hooks/useAddToCart';
import styles from './ProductCard.module.css';

interface Author {
  id?: string;
  email: string;
  full_name: string;
  is_online: boolean;
  level: string;
  profile_image: string;
  user_name: string;
  first_name?: string;
  last_name?: string;
}

interface ProductCardProps {
  id: string;
  img: string;
  author?: Author;
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
  const authorName = author?.full_name
    ? author.full_name
    : `${author?.first_name || ''} ${author?.last_name || ''}`.trim();
  const inCart = isInCart(id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) return;
    await addToCart(id, { quantity: 1, lic_type: 'REGULAR' });
  };

  return (
    <div className={`${styles.productCard} ${isSmall ? styles.small : ''} ${className}`}>
      <Link href={`/product-details/${slug}`} className={styles.stretchedLink} />

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
          height={isSmall ? 120 : 200}
          className={styles.productImage}
          style={{ width: '100%', height: isSmall ? '120px' : 'auto' }}
        />
      </div>

      <div className={`${styles.content} ${isSmall ? styles.contentSmall : ''}`}>
        <div className={`${styles.authorLine} ${isSmall ? styles.textSmall : ''}`}>
          by{' '}
          <Link href={`/${author?.user_name || ''}`} className={styles.authorLink}>
            {authorName}
          </Link>
        </div>

        <h5 className={`${styles.title} ${isSmall ? styles.titleSmall : ''}`}>
          <Link href={`/product-details/${slug}`}>{title}</Link>
        </h5>

        {rating > 0 && reviews > 0 && (
          <ReviewStars
            rating={rating}
            reviewCount={reviews}
            className={isSmall ? styles.textSmall : ''}
            size={isSmall ? 10 : 13.5}
          />
        )}

        <div className={styles.metaSection}>
          <hr className={`${styles.divider} ${isSmall ? styles.dividerSmall : ''}`} />
          <div className={styles.meta}>
            <div className={styles.priceSection}>
              {discountPrice || isFreeProduct ? (
                <div className={styles.priceWithDiscount}>
                  <span className={`${styles.originalPrice} ${isSmall ? styles.priceSmall : ''}`}>
                    ${price}
                  </span>
                  <span className={`${styles.discountPrice} ${isSmall ? styles.priceSmall : ''}`}>
                    ${discountPrice}
                  </span>
                </div>
              ) : (
                <span className={`${styles.price} ${isSmall ? styles.priceSmall : ''}`}>
                  ${price}
                </span>
              )}
              <div className={styles.salesCount}>{sales} Sales</div>
            </div>

            <div className={styles.actions}>
              <button
                className={`${styles.cartButton} ${isSmall ? styles.buttonSmall : ''} ${inCart ? styles.inCart : ''}`}
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
                className={`${styles.previewButton} ${isSmall ? styles.buttonSmall : ''}`}
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
