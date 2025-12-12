// MIGRATION: SidebarFilter component - Left sidebar filter like PackMyCode
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import styles from './SidebarFilter.module.css';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface PriceRange {
  min: number;
  max: number;
  label: string;
}

export interface ActiveFilters {
  categories: string[];
  priceRange: PriceRange | null;
  rating: number | null;
}

interface SidebarFilterProps {
  categories: FilterOption[];
  activeFilters: ActiveFilters;
  onFiltersChange: (filters: ActiveFilters) => void;
}

const PRICE_RANGES: PriceRange[] = [
  { min: 0, max: 50, label: 'Under $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: 200, label: '$100 - $200' },
  { min: 200, max: 100000, label: '$200 & above' },
];

const RATINGS = [4, 3, 2, 1];

export default function SidebarFilter({
  categories,
  activeFilters,
  onFiltersChange,
}: SidebarFilterProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = activeFilters.categories.includes(categoryId)
      ? activeFilters.categories.filter((c) => c !== categoryId)
      : [...activeFilters.categories, categoryId];
    onFiltersChange({ ...activeFilters, categories: newCategories });
  };

  const handlePriceSelect = (range: PriceRange | null) => {
    onFiltersChange({ ...activeFilters, priceRange: range });
  };

  const handleRatingSelect = (rating: number | null) => {
    onFiltersChange({ ...activeFilters, rating });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: null,
      rating: null,
    });
  };

  const hasActiveFilters =
    activeFilters.categories.length > 0 ||
    activeFilters.priceRange !== null ||
    activeFilters.rating !== null;

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filters</h3>
        {hasActiveFilters && (
          <button className={styles.clearAll} onClick={clearAllFilters}>
            Clear all
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className={styles.section}>
        <button className={styles.sectionHeader} onClick={() => toggleSection('category')}>
          <span>Category</span>
          {expandedSections.category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {expandedSections.category && (
          <div className={styles.sectionContent}>
            {categories.map((cat) => (
              <label key={cat.id} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={activeFilters.categories.includes(cat.id)}
                  onChange={() => handleCategoryToggle(cat.id)}
                />
                <span className={styles.checkboxLabel}>{cat.label}</span>
                {cat.count !== undefined && (
                  <span className={styles.count}>{cat.count}</span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className={styles.section}>
        <button className={styles.sectionHeader} onClick={() => toggleSection('price')}>
          <span>Price</span>
          {expandedSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {expandedSections.price && (
          <div className={styles.sectionContent}>
            <label className={styles.radioItem}>
              <input
                type="radio"
                name="price"
                checked={activeFilters.priceRange === null}
                onChange={() => handlePriceSelect(null)}
              />
              <span>Any Price</span>
            </label>
            {PRICE_RANGES.map((range) => (
              <label key={range.label} className={styles.radioItem}>
                <input
                  type="radio"
                  name="price"
                  checked={activeFilters.priceRange?.label === range.label}
                  onChange={() => handlePriceSelect(range)}
                />
                <span>{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className={styles.section}>
        <button className={styles.sectionHeader} onClick={() => toggleSection('rating')}>
          <span>Rating</span>
          {expandedSections.rating ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {expandedSections.rating && (
          <div className={styles.sectionContent}>
            <label className={styles.radioItem}>
              <input
                type="radio"
                name="rating"
                checked={activeFilters.rating === null}
                onChange={() => handleRatingSelect(null)}
              />
              <span>Any Rating</span>
            </label>
            {RATINGS.map((rating) => (
              <label key={rating} className={styles.radioItem}>
                <input
                  type="radio"
                  name="rating"
                  checked={activeFilters.rating === rating}
                  onChange={() => handleRatingSelect(rating)}
                />
                <span className={styles.ratingLabel}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < rating ? styles.starFilled : styles.starEmpty}
                      fill={i < rating ? 'currentColor' : 'none'}
                    />
                  ))}
                  <span>& up</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
