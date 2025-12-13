// MIGRATION: Marketplace page with LEFT SIDEBAR filter, toggle, products/services grid
'use client';

import { useState, useMemo } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { ListingToggle, type ListingType } from '@/components/pmc-migrated/marketplace/listing-toggle';
import { SidebarFilter, type ActiveFilters } from '@/components/pmc-migrated/marketplace/sidebar-filter';
// import { FilterBar, type ActiveFilters } from '@/components/pmc-migrated/marketplace/filter-bar'; // TOP BAR STYLE (commented)
import { ProductCard } from '@/components/pmc-migrated/marketplace/product-card';
import { ServiceCard } from '@/components/pmc-migrated/marketplace/service-card';
import { SearchModal } from '@/components/pmc-migrated/marketplace/search-bar';
// MOCK: Using mock data until real API is connected
import { mockCategories } from '@/lib/mocks/categories.mock';
import { mockFeaturedProducts, mockTrendingProducts } from '@/lib/mocks/products.mock';
import { mockFeaturedServices, mockTrendingServices } from '@/lib/mocks/services.mock';
import styles from './page.module.css';

// MOCK: Combine products and services
const allProducts = [...mockFeaturedProducts, ...mockTrendingProducts];
const allServices = [...mockFeaturedServices, ...mockTrendingServices];

// MOCK: Filter categories with deterministic counts (avoid hydration mismatch)
const filterCategories = mockCategories.map((cat, index) => ({
  id: cat.slug,
  label: cat.title,
  count: ((index + 1) * 17) % 89 + 10, // Deterministic pseudo-random: 27, 44, 61, 78, 6, 23...
}));

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'popular', label: 'Most Popular' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
];

export default function MarketplacePage() {
  const [listingType, setListingType] = useState<ListingType>('products');
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categories: [],
    priceRange: null,
    rating: null,
  });

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (activeFilters.priceRange) {
      result = result.filter(
        (p) => p.price >= activeFilters.priceRange!.min && p.price <= activeFilters.priceRange!.max
      );
    }

    if (activeFilters.rating) {
      result = result.filter((p) => p.avg_rating >= activeFilters.rating!);
    }

    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.total_sales - a.total_sales);
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.avg_rating - a.avg_rating);
        break;
    }

    return result;
  }, [activeFilters, sortBy]);

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let result = [...allServices];

    if (activeFilters.priceRange) {
      result = result.filter(
        (s) => s.price >= activeFilters.priceRange!.min && s.price <= activeFilters.priceRange!.max
      );
    }

    if (activeFilters.rating) {
      result = result.filter((s) => s.avg_rating >= activeFilters.rating!);
    }

    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.total_sales - a.total_sales);
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.avg_rating - a.avg_rating);
        break;
    }

    return result;
  }, [activeFilters, sortBy]);

  const currentItems = listingType === 'products' ? filteredProducts : filteredServices;

  // Reset filters when switching listing type
  const handleToggle = (type: ListingType) => {
    setListingType(type);
    setActiveFilters({
      categories: [],
      priceRange: null,
      rating: null,
    });
  };

  return (
    <div className={styles.container}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Marketplace</h1>
          <ListingToggle activeType={listingType} onToggle={handleToggle} />
        </div>

        <button onClick={() => setShowSearch(true)} className={styles.searchButton}>
          <Search size={16} />
          <span>Search {listingType}...</span>
          <kbd>/</kbd>
        </button>
      </div>

      {/* Main Content with Sidebar */}
      <div className={styles.mainContent}>
        {/* Left Sidebar Filter */}
        <SidebarFilter
          categories={filterCategories}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
        />

        {/* Right Content Area */}
        <div className={styles.contentArea}>
          {/* Sort Bar */}
          <div className={styles.sortBar}>
            <span className={styles.resultCount}>
              {currentItems.length} {listingType}
            </span>
            <div className={styles.sortSelect}>
              <ArrowUpDown size={14} />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          {currentItems.length > 0 ? (
            <div className={styles.grid}>
              {listingType === 'products'
                ? filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      img={product.thumbnail_image}
                      author={product.creator}
                      title={product.title}
                      slug={product.slug}
                      rating={product.avg_rating}
                      reviews={product.total_reviews}
                      price={product.price}
                      discountPrice={product.mrp && product.mrp < product.price ? product.mrp : 0}
                      isOnSale={product.is_onsale}
                      trendingStatus={product.is_trending}
                      sales={product.total_sales}
                      is_liked={product.is_liked}
                      isFreeProduct={product.mrp === 0}
                      isPixiCompatible={product.is_pixi_compatible}
                    />
                  ))
                : filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      id={service.id}
                      slug={service.slug}
                      img={service.thumbnail_image}
                      author={service.creator?.full_name}
                      authorProfileLink={`/${service.creator?.user_name}`}
                      category={service.category}
                      categoryId={service.category_id}
                      title={service.title}
                      rating={service.avg_rating}
                      reviews={service.total_reviews}
                      authorImg={service.creator?.profile_image}
                      authorName={service.creator?.full_name}
                      price={service.price}
                      discountPrice={service.mrp && service.mrp < service.price ? service.mrp : 0}
                      isOnSale={service.is_onsale}
                      trendingStatus={service.is_trending}
                      is_liked={service.is_liked}
                      isPixiCompatible={service.is_pixi_compatible}
                    />
                  ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No {listingType} found matching your filters.</p>
              <button
                onClick={() =>
                  setActiveFilters({ categories: [], priceRange: null, rating: null })
                }
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Modal */}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </div>
  );
}
