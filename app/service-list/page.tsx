// Service list page using RTK Query
'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { FilterBar, type ActiveFilters } from '@/components/pmc-migrated/marketplace/filter-bar';
import { ServiceCard } from '@/components/pmc-migrated/marketplace/service-card';
import {
  useGetServicesQuery,
  useGetServiceFilterOptionsQuery,
} from '@/state/services/home-service/public-service.service';
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

  // Build query params for RTK Query
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      page: 1,
      limit: 50,
    };

    // Add category filter
    if (activeFilters.categories.length > 0) {
      params.category_ids = activeFilters.categories;
    }

    // Add price range filter
    if (activeFilters.priceRange) {
      params.priceMin = activeFilters.priceRange.min;
      params.priceMax = activeFilters.priceRange.max;
    }

    return params;
  }, [activeFilters]);

  // Fetch services using RTK Query
  const {
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError,
    refetch: refetchServices,
  } = useGetServicesQuery({ queryParams });

  // Fetch filter options (aggregations) using RTK Query
  const {
    data: filterOptions,
    isLoading: filterOptionsLoading,
  } = useGetServiceFilterOptionsQuery();

  // Map filter options to categories format
  const categories = useMemo(() => {
    if (!filterOptions?.categories) return [];
    return filterOptions.categories.map((cat: any) => ({
      id: cat.id || cat._id,
      label: cat.name || cat.title,
      count: cat.count || 0,
    }));
  }, [filterOptions]);

  // Get services list from response
  const services = useMemo(() => {
    if (!servicesData?.items) return [];

    let serviceList = servicesData.items;

    // Apply client-side sorting if needed
    if (activeFilters.sortBy === 'price_low') {
      serviceList = [...serviceList].sort((a: any, b: any) => a.price - b.price);
    } else if (activeFilters.sortBy === 'price_high') {
      serviceList = [...serviceList].sort((a: any, b: any) => b.price - a.price);
    } else if (activeFilters.sortBy === 'rating') {
      serviceList = [...serviceList].sort((a: any, b: any) => b.avg_rating - a.avg_rating);
    }

    // Apply rating filter client-side
    if (activeFilters.rating) {
      serviceList = serviceList.filter((s: any) => s.avg_rating >= activeFilters.rating!);
    }

    return serviceList;
  }, [servicesData, activeFilters.sortBy, activeFilters.rating]);

  const loading = servicesLoading || filterOptionsLoading;
  const error = servicesError ? 'Failed to load services. Please try again.' : null;

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
          <button onClick={() => refetchServices()}>Try again</button>
        </div>
      )}

      {/* Service Grid */}
      {!loading && !error && services.length > 0 && (
        <div className={styles.grid}>
          {services.map((service: any) => (
            <ServiceCard
              key={service.id || service._id}
              id={service.id || service._id}
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
