// MIGRATION: Service list page with centralized API
'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { FilterBar, type ActiveFilters } from '@/components/pmc-migrated/marketplace/filter-bar';
import { ServiceCard } from '@/components/pmc-migrated/marketplace/service-card';
import { getServices, type ServiceListItem, type ServiceFilters } from '@/lib/api/services';
import styles from './page.module.css';

export default function ServiceListPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>}>
      <ServiceListContent />
    </Suspense>
  );
}

function ServiceListContent() {
  const searchParams = useSearchParams();

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categories: [],
    priceRange: null,
    rating: null,
    sortBy: 'newest',
  });

  // Data states
  const [services, setServices] = useState<ServiceListItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; label: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch services using centralized API
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build filters from activeFilters state
      const filters: ServiceFilters = {
        page: 1,
        limit: 50,
        sortBy: activeFilters.sortBy as ServiceFilters['sortBy'],
      };

      // Add category filter if selected
      if (activeFilters.categories.length === 1) {
        filters.categoryId = activeFilters.categories[0];
      }

      // Add price range filter
      if (activeFilters.priceRange) {
        filters.minPrice = activeFilters.priceRange.min;
        filters.maxPrice = activeFilters.priceRange.max;
      }

      // Add rating filter
      if (activeFilters.rating) {
        filters.minRating = activeFilters.rating;
      }

      const response = await getServices(filters);

      // Apply multi-category filter client-side (API supports single category)
      let serviceList = response.services;
      if (activeFilters.categories.length > 1) {
        serviceList = serviceList.filter((s) =>
          activeFilters.categories.includes(s.category_id || '')
        );
      }

      setServices(serviceList);
      setCategories(response.categories);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setError('Failed to load services. Please try again.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [activeFilters]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Services</h1>
        <p className={styles.subtitle}>Find skilled professionals for your next project</p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        categories={categories}
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
        totalResults={services.length}
        listingType="services"
      />

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className={styles.emptyState}>
          <p>{error}</p>
          <button onClick={fetchServices}>Try again</button>
        </div>
      )}

      {/* Service Grid */}
      {!loading && !error && services.length > 0 && (
        <div className={styles.grid}>
          {services.map((service) => (
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
      )}

      {/* Empty State */}
      {!loading && !error && services.length === 0 && (
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
