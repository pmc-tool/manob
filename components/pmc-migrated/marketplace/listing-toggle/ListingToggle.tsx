// MIGRATION: Toggle component for switching between Products and Services
'use client';

import { Package, Briefcase } from 'lucide-react';
import styles from './ListingToggle.module.css';

export type ListingType = 'products' | 'services';

interface ListingToggleProps {
  activeType: ListingType;
  onToggle: (type: ListingType) => void;
}

export default function ListingToggle({ activeType, onToggle }: ListingToggleProps) {
  return (
    <div className={styles.toggleContainer}>
      <button
        className={`${styles.toggleButton} ${activeType === 'products' ? styles.active : ''}`}
        onClick={() => onToggle('products')}
      >
        <Package size={18} />
        <span>Products</span>
      </button>
      <button
        className={`${styles.toggleButton} ${activeType === 'services' ? styles.active : ''}`}
        onClick={() => onToggle('services')}
      >
        <Briefcase size={18} />
        <span>Services</span>
      </button>
      <div
        className={styles.slider}
        style={{
          transform: activeType === 'services' ? 'translateX(100%)' : 'translateX(0)',
        }}
      />
    </div>
  );
}
