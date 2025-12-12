// MIGRATION: ProductCardSkeleton component for loading state
'use client';

import styles from './ProductCardSkeleton.module.css';

export function ProductCardSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.imageWrapper}>
        <div className={styles.imagePlaceholder} />
      </div>
      <div className={styles.content}>
        <div className={styles.authorLine} />
        <div className={styles.title} />
        <div className={styles.titleSecond} />
        <div className={styles.rating} />
        <div className={styles.divider} />
        <div className={styles.meta}>
          <div className={styles.price} />
          <div className={styles.actions} />
        </div>
      </div>
    </div>
  );
}
