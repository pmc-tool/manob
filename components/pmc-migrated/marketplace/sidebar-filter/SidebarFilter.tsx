// MIGRATION: SidebarFilter component - Left sidebar filter like manob.ai
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';

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
    <div className="w-[240px] flex-shrink-0 bg-white rounded-xl border border-gray-200 overflow-hidden hidden md:block">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 m-0">Filters</h3>
        {hasActiveFilters && (
          <button className="text-xs font-medium text-primary bg-transparent border-none cursor-pointer p-0 hover:underline" onClick={clearAllFilters}>
            Clear all
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          className="flex items-center justify-between w-full px-4 py-3.5 text-sm font-semibold text-gray-700 bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-gray-50"
          onClick={() => toggleSection('category')}
        >
          <span>Category</span>
          {expandedSections.category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {expandedSections.category && (
          <div className="px-4 pb-4 flex flex-col gap-1">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-colors text-[13px] text-gray-700 hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={activeFilters.categories.includes(cat.id)}
                  onChange={() => handleCategoryToggle(cat.id)}
                  className="w-4 h-4 accent-primary cursor-pointer flex-shrink-0"
                />
                <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{cat.label}</span>
                {cat.count !== undefined && (
                  <span className="text-xs text-gray-400 flex-shrink-0">{cat.count}</span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          className="flex items-center justify-between w-full px-4 py-3.5 text-sm font-semibold text-gray-700 bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-gray-50"
          onClick={() => toggleSection('price')}
        >
          <span>Price</span>
          {expandedSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {expandedSections.price && (
          <div className="px-4 pb-4 flex flex-col gap-1">
            <label className="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-colors text-[13px] text-gray-700 hover:bg-gray-100">
              <input
                type="radio"
                name="price"
                checked={activeFilters.priceRange === null}
                onChange={() => handlePriceSelect(null)}
                className="w-4 h-4 accent-primary cursor-pointer flex-shrink-0"
              />
              <span>Any Price</span>
            </label>
            {PRICE_RANGES.map((range) => (
              <label key={range.label} className="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-colors text-[13px] text-gray-700 hover:bg-gray-100">
                <input
                  type="radio"
                  name="price"
                  checked={activeFilters.priceRange?.label === range.label}
                  onChange={() => handlePriceSelect(range)}
                  className="w-4 h-4 accent-primary cursor-pointer flex-shrink-0"
                />
                <span>{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          className="flex items-center justify-between w-full px-4 py-3.5 text-sm font-semibold text-gray-700 bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-gray-50"
          onClick={() => toggleSection('rating')}
        >
          <span>Rating</span>
          {expandedSections.rating ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {expandedSections.rating && (
          <div className="px-4 pb-4 flex flex-col gap-1">
            <label className="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-colors text-[13px] text-gray-700 hover:bg-gray-100">
              <input
                type="radio"
                name="rating"
                checked={activeFilters.rating === null}
                onChange={() => handleRatingSelect(null)}
                className="w-4 h-4 accent-primary cursor-pointer flex-shrink-0"
              />
              <span>Any Rating</span>
            </label>
            {RATINGS.map((rating) => (
              <label key={rating} className="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-colors text-[13px] text-gray-700 hover:bg-gray-100">
                <input
                  type="radio"
                  name="rating"
                  checked={activeFilters.rating === rating}
                  onChange={() => handleRatingSelect(rating)}
                  className="w-4 h-4 accent-primary cursor-pointer flex-shrink-0"
                />
                <span className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
                      fill={i < rating ? 'currentColor' : 'none'}
                    />
                  ))}
                  <span className="ml-1 text-gray-500">& up</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
