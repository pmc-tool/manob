// MIGRATION: FilterBar component - Top horizontal filter bar - converted to Tailwind CSS
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

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
    <div className="bg-white border-b border-gray-200 py-3 px-4" ref={dropdownRef}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Dropdown */}
          <div className="relative">
            <button
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${activeFilters.categories.length > 0 ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}
              onClick={() => toggleDropdown('category')}
            >
              <span>Category</span>
              {activeFilters.categories.length > 0 && (
                <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">{activeFilters.categories.length}</span>
              )}
              <ChevronDown size={14} className={`transition-transform ${openDropdown === 'category' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'category' && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
                <div className="px-3 py-2 border-b border-gray-100 font-medium text-sm text-gray-900">Categories</div>
                <div className="max-h-[280px] overflow-y-auto p-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeFilters.categories.includes(cat.id)}
                        onChange={() => handleCategoryToggle(cat.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{cat.label}</span>
                      {cat.count !== undefined && (
                        <span className="text-xs text-gray-400 ml-auto">({cat.count})</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Price Dropdown */}
          <div className="relative">
            <button
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${activeFilters.priceRange ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}
              onClick={() => toggleDropdown('price')}
            >
              <span>{activeFilters.priceRange?.label || 'Price'}</span>
              <ChevronDown size={14} className={`transition-transform ${openDropdown === 'price' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'price' && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
                <div className="px-3 py-2 border-b border-gray-100 font-medium text-sm text-gray-900">Price Range</div>
                <div className="p-2">
                  <button
                    className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${!activeFilters.priceRange ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => handlePriceSelect(null)}
                  >
                    Any Price
                  </button>
                  {PRICE_RANGES.map((range) => (
                    <button
                      key={range.label}
                      className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${activeFilters.priceRange?.label === range.label ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
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
          <div className="relative">
            <button
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${activeFilters.rating ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}
              onClick={() => toggleDropdown('rating')}
            >
              <span>{activeFilters.rating ? `${activeFilters.rating}+ Stars` : 'Rating'}</span>
              <ChevronDown size={14} className={`transition-transform ${openDropdown === 'rating' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'rating' && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px]">
                <div className="px-3 py-2 border-b border-gray-100 font-medium text-sm text-gray-900">Minimum Rating</div>
                <div className="p-2">
                  <button
                    className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${!activeFilters.rating ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => handleRatingSelect(null)}
                  >
                    Any Rating
                  </button>
                  {RATINGS.map((rating) => (
                    <button
                      key={rating}
                      className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${activeFilters.rating === rating ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
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
          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border bg-white border-gray-200 text-gray-700 hover:border-gray-300 transition-colors"
              onClick={() => toggleDropdown('sort')}
            >
              <span>Sort: {SORT_OPTIONS.find((s) => s.id === activeFilters.sortBy)?.label}</span>
              <ChevronDown size={14} className={`transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'sort' && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                <div className="px-3 py-2 border-b border-gray-100 font-medium text-sm text-gray-900">Sort By</div>
                <div className="p-2">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${activeFilters.sortBy === option.id ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
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

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{totalResults.toLocaleString()} {listingType}</span>
          {activeFilterCount > 0 && (
            <button className="text-sm text-primary hover:underline" onClick={clearAllFilters}>
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {activeFilters.categories.map((catId) => (
            <span key={catId} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-sm text-gray-700 rounded-full">
              {getCategoryLabel(catId)}
              <button onClick={() => removeCategory(catId)} className="text-gray-400 hover:text-gray-600">
                <X size={12} />
              </button>
            </span>
          ))}
          {activeFilters.priceRange && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-sm text-gray-700 rounded-full">
              {activeFilters.priceRange.label}
              <button onClick={() => handlePriceSelect(null)} className="text-gray-400 hover:text-gray-600">
                <X size={12} />
              </button>
            </span>
          )}
          {activeFilters.rating && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-sm text-gray-700 rounded-full">
              {activeFilters.rating}+ Stars
              <button onClick={() => handleRatingSelect(null)} className="text-gray-400 hover:text-gray-600">
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
