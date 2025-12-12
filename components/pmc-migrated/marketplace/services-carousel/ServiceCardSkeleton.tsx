// MIGRATION: ServiceCardSkeleton component for loading state
'use client';

import styles from './ServiceCardSkeleton.module.css';

export function ServiceCardSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.imageWrapper}>
        <div className={styles.imagePlaceholder} />
      </div>
      <div className={styles.content}>
        <div className={styles.metaLine} />
        <div className={styles.title} />
        <div className={styles.titleSecond} />
        <div className={styles.rating} />
        <div className={styles.divider} />
        <div className={styles.footer}>
          <div className={styles.avatar} />
          <div className={styles.authorName} />
          <div className={styles.price} />
        </div>
      </div>
    </div>
  );
}
