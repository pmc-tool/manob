// MIGRATION: Service list page with filters
'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterBar, type ActiveFilters } from '@/components/pmc-migrated/marketplace/filter-bar';
import { ServiceCard } from '@/components/pmc-migrated/marketplace/service-card';
import { mockFeaturedServices, mockTrendingServices } from '@/lib/mocks/services.mock';
import { mockCategories } from '@/lib/mocks/categories.mock';
import styles from './page.module.css';

// MOCK: Combine all services for the list
const allServices = [...mockFeaturedServices, ...mockTrendingServices];

// MOCK: Filter categories for the dropdown
const filterCategories = mockCategories.map((cat) => ({
  id: cat.slug,
  label: cat.title,
  count: Math.floor(Math.random() * 50) + 5,
}));

export default function ServiceListPage() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter');

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categories: [],
    priceRange: null,
    rating: null,
    sortBy: 'newest',
  });

  // MOCK: Filter and sort services
  const filteredServices = useMemo(() => {
    let result = [...allServices];

    // Filter by category
    if (activeFilters.categories.length > 0) {
      result = result.filter((s) =>
        activeFilters.categories.includes(s.category_id || '')
      );
      // If no matches (mock data), show all
      if (result.length === 0) result = [...allServices];
    }

    // Filter by price
    if (activeFilters.priceRange) {
      result = result.filter(
        (s) => s.price >= activeFilters.priceRange!.min && s.price <= activeFilters.priceRange!.max
      );
    }

    // Filter by rating
    if (activeFilters.rating) {
      result = result.filter((s) => s.avg_rating >= activeFilters.rating!);
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
        <h1 className={styles.title}>Services</h1>
        <p className={styles.subtitle}>Find skilled professionals for your next project</p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        categories={filterCategories}
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
        totalResults={filteredServices.length}
        listingType="services"
      />

      {/* Service Grid */}
      {filteredServices.length > 0 ? (
        <div className={styles.grid}>
          {filteredServices.map((service) => (
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
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No services found matching your filters.</p>
          <button onClick={() => setActiveFilters({ categories: [], priceRange: null, rating: null, sortBy: 'newest' })}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
