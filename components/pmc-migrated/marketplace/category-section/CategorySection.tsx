// MIGRATION: Category section from PackMyCode homepage
// Redesigned as compact horizontal chips
'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Category } from '@/lib/mocks/categories.mock';
import styles from './CategorySection.module.css';

interface CategorySectionProps {
  categories: Category[];
  title?: string;
  allCategoriesLink?: string;
}

export default function CategorySection({
  categories,
  title = 'Categories',
  allCategoriesLink = '/categories',
}: CategorySectionProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className={styles.categorySection}>
      <div className={styles.scrollContainer}>
        <span className={styles.label}>{title}:</span>
        <div className={styles.chipList}>
          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/categories/${item.slug}`}
              className={styles.chip}
            >
              <span className={styles.chipIcon}>{item.title.charAt(0)}</span>
              <span className={styles.chipText}>{item.title}</span>
            </Link>
          ))}
          <Link href={allCategoriesLink} className={styles.viewAll}>
            View All
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
