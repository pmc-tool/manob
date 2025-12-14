// Showcase Section - Reusable gallery component
'use client';

import Image from 'next/image';
import styles from './home.module.css';

export interface ShowcaseItem {
  id: string;
  image?: string;
  gradient?: string;
  alt?: string;
}

interface ShowcaseSectionProps {
  title?: string;
  subtitle?: string;
  items?: ShowcaseItem[];
}

const defaultItems: ShowcaseItem[] = [
  { id: '1', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)' },
  { id: '2', gradient: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)' },
  { id: '3', gradient: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)' },
  { id: '4', gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)' },
  { id: '5', gradient: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)' },
];

export default function ShowcaseSection({
  title = 'Recent human + AI launches',
  subtitle = 'Products, dashboards, and storefronts shipped on manob.ai',
  items = defaultItems,
}: ShowcaseSectionProps) {
  return (
    <section className={styles.showcaseSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeaderCenter}>
          <h2 className={styles.sectionTitleLarge}>{title}</h2>
          <p className={styles.sectionSubtitleSmall}>{subtitle}</p>
        </div>

        {/* Showcase Grid */}
        <div className={styles.showcaseGrid}>
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`${styles.showcaseItem} ${index >= 3 ? styles.showcaseItemHiddenMd : ''} ${index >= 4 ? styles.showcaseItemHiddenLg : ''}`}
              style={{ background: item.gradient || '#e5e7eb' }}
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.alt || 'Showcase item'}
                  fill
                  className={styles.showcaseImage}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
