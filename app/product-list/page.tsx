// MIGRATION: Product list page with filters
'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterBar, type ActiveFilters } from '@/components/pmc-migrated/marketplace/filter-bar';
import { ProductCard } from '@/components/pmc-migrated/marketplace/product-card';
import { mockFeaturedProducts, mockTrendingProducts } from '@/lib/mocks/products.mock';
import { mockCategories } from '@/lib/mocks/categories.mock';
import styles from './page.module.css';

// MOCK: Combine all products for the list
const allProducts = [...mockFeaturedProducts, ...mockTrendingProducts];

// MOCK: Filter categories for the dropdown
const filterCategories = mockCategories.map((cat) => ({
  id: cat.slug,
  label: cat.title,
  count: Math.floor(Math.random() * 100) + 10,
}));

export default function ProductListPage() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter');

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categories: [],
    priceRange: null,
    rating: null,
    sortBy: 'newest',
  });

  // MOCK: Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Filter by category
    if (activeFilters.categories.length > 0) {
      // MOCK: Since our mock products don't have category slugs, show all for demo
      // In real implementation, filter by category_id
    }

    // Filter by price
    if (activeFilters.priceRange) {
      result = result.filter(
        (p) => p.price >= activeFilters.priceRange!.min && p.price <= activeFilters.priceRange!.max
      );
    }

    // Filter by rating
    if (activeFilters.rating) {
      result = result.filter((p) => p.avg_rating >= activeFilters.rating!);
    }

    // Sort
    switch (activeFilters.sortBy) {
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
      default:
        // newest - keep original order
        break;
    }

    return result;
  }, [activeFilters]);

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.subtitle}>Browse our collection of premium digital products</p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        categories={filterCategories}
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
        totalResults={filteredProducts.length}
        listingType="products"
      />

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
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
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No products found matching your filters.</p>
          <button onClick={() => setActiveFilters({ categories: [], priceRange: null, rating: null, sortBy: 'newest' })}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
