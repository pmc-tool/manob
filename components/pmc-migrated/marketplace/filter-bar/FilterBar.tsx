// MIGRATION: FilterBar component - Top horizontal filter bar
// Replaces left sidebar filter to work with PMC Engine dashboard shell
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import styles from './FilterBar.module.css';

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
  sortBy: string;
}

interface FilterBarProps {
  categories: FilterOption[];
  onFiltersChange: (filters: ActiveFilters) => void;
  activeFilters: ActiveFilters;
  totalResults?: number;
  listingType?: 'products' | 'services';
}

const PRICE_RANGES: PriceRange[] = [
  { min: 0, max: 50, label: 'Under $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: 200, label: '$100 - $200' },
  { min: 200, max: 100000, label: '$200+' },
];

const RATINGS = [4, 3, 2, 1];

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'popular', label: 'Most Popular' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
];

export default function FilterBar({
  categories,
  onFiltersChange,
  activeFilters,
  totalResults = 0,
  listingType = 'products',
}: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = activeFilters.categories.includes(categoryId)
      ? activeFilters.categories.filter((c) => c !== categoryId)
      : [...activeFilters.categories, categoryId];
    onFiltersChange({ ...activeFilters, categories: newCategories });
  };

  const handlePriceSelect = (range: PriceRange | null) => {
    onFiltersChange({ ...activeFilters, priceRange: range });
    setOpenDropdown(null);
  };

  const handleRatingSelect = (rating: number | null) => {
    onFiltersChange({ ...activeFilters, rating });
    setOpenDropdown(null);
  };

  const handleSortSelect = (sortBy: string) => {
    onFiltersChange({ ...activeFilters, sortBy });
    setOpenDropdown(null);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: null,
      rating: null,
      sortBy: 'newest',
    });
  };

  const removeCategory = (categoryId: string) => {
    onFiltersChange({
      ...activeFilters,
      categories: activeFilters.categories.filter((c) => c !== categoryId),
    });
  };

  const activeFilterCount =
    activeFilters.categories.length +
    (activeFilters.priceRange ? 1 : 0) +
    (activeFilters.rating ? 1 : 0);

  const getCategoryLabel = (id: string) => categories.find((c) => c.id === id)?.label || id;

  return (
    <div className={styles.filterBar} ref={dropdownRef}>
      <div className={styles.filterRow}>
        <div className={styles.filters}>
          {/* Category Dropdown */}
          <div className={styles.dropdown}>
            <button
              className={`${styles.dropdownTrigger} ${activeFilters.categories.length > 0 ? styles.active : ''}`}
              onClick={() => toggleDropdown('category')}
            >
              <span>Category</span>
              {activeFilters.categories.length > 0 && (
                <span className={styles.badge}>{activeFilters.categories.length}</span>
              )}
              <ChevronDown size={14} className={openDropdown === 'category' ? styles.rotated : ''} />
            </button>
            {openDropdown === 'category' && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>Categories</div>
                <div className={styles.dropdownContent}>
                  {categories.map((cat) => (
                    <label key={cat.id} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={activeFilters.categories.includes(cat.id)}
                        onChange={() => handleCategoryToggle(cat.id)}
                      />
                      <span className={styles.checkboxLabel}>{cat.label}</span>
                      {cat.count !== undefined && (
                        <span className={styles.count}>({cat.count})</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Price Dropdown */}
          <div className={styles.dropdown}>
            <button
              className={`${styles.dropdownTrigger} ${activeFilters.priceRange ? styles.active : ''}`}
              onClick={() => toggleDropdown('price')}
            >
              <span>{activeFilters.priceRange?.label || 'Price'}</span>
              <ChevronDown size={14} className={openDropdown === 'price' ? styles.rotated : ''} />
            </button>
            {openDropdown === 'price' && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>Price Range</div>
                <div className={styles.dropdownContent}>
                  <button
                    className={`${styles.radioItem} ${!activeFilters.priceRange ? styles.selected : ''}`}
                    onClick={() => handlePriceSelect(null)}
                  >
                    Any Price
                  </button>
                  {PRICE_RANGES.map((range) => (
                    <button
                      key={range.label}
                      className={`${styles.radioItem} ${activeFilters.priceRange?.label === range.label ? styles.selected : ''}`}
                      onClick={() => handlePriceSelect(range)}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rating Dropdown */}
          <div className={styles.dropdown}>
            <button
              className={`${styles.dropdownTrigger} ${activeFilters.rating ? styles.active : ''}`}
              onClick={() => toggleDropdown('rating')}
            >
              <span>{activeFilters.rating ? `${activeFilters.rating}+ Stars` : 'Rating'}</span>
              <ChevronDown size={14} className={openDropdown === 'rating' ? styles.rotated : ''} />
            </button>
            {openDropdown === 'rating' && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>Minimum Rating</div>
                <div className={styles.dropdownContent}>
                  <button
                    className={`${styles.radioItem} ${!activeFilters.rating ? styles.selected : ''}`}
                    onClick={() => handleRatingSelect(null)}
                  >
                    Any Rating
                  </button>
                  {RATINGS.map((rating) => (
                    <button
                      key={rating}
                      className={`${styles.radioItem} ${activeFilters.rating === rating ? styles.selected : ''}`}
                      onClick={() => handleRatingSelect(rating)}
                    >
                      {rating}+ Stars
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownTrigger}
              onClick={() => toggleDropdown('sort')}
            >
              <span>Sort: {SORT_OPTIONS.find((s) => s.id === activeFilters.sortBy)?.label}</span>
              <ChevronDown size={14} className={openDropdown === 'sort' ? styles.rotated : ''} />
            </button>
            {openDropdown === 'sort' && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>Sort By</div>
                <div className={styles.dropdownContent}>
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      className={`${styles.radioItem} ${activeFilters.sortBy === option.id ? styles.selected : ''}`}
                      onClick={() => handleSortSelect(option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.resultInfo}>
          <span className={styles.resultCount}>{totalResults.toLocaleString()} {listingType}</span>
          {activeFilterCount > 0 && (
            <button className={styles.clearAll} onClick={clearAllFilters}>
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className={styles.activeTags}>
          {activeFilters.categories.map((catId) => (
            <span key={catId} className={styles.tag}>
              {getCategoryLabel(catId)}
              <button onClick={() => removeCategory(catId)}>
                <X size={12} />
              </button>
            </span>
          ))}
          {activeFilters.priceRange && (
            <span className={styles.tag}>
              {activeFilters.priceRange.label}
              <button onClick={() => handlePriceSelect(null)}>
                <X size={12} />
              </button>
            </span>
          )}
          {activeFilters.rating && (
            <span className={styles.tag}>
              {activeFilters.rating}+ Stars
              <button onClick={() => handleRatingSelect(null)}>
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
