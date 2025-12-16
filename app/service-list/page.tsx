// MIGRATION: Service list page with real API data
'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { FilterBar, type ActiveFilters } from '@/components/pmc-migrated/marketplace/filter-bar';
import { ServiceCard } from '@/components/pmc-migrated/marketplace/service-card';
import styles from './page.module.css';

const API_URL_FEED = process.env.NEXT_PUBLIC_API_URL_FEED || '';
const S3_BUCKET = process.env.NEXT_PUBLIC_S3BUCKET || '';

// API Response interface
interface ApiService {
  id: string;
  service_title: string;
  slug: string;
  thumbnail_image: string;
  price: number;
  mrp: number;
  avg_rating: string;
  total_reviews: number;
  total_sales: number;
  is_onsale: boolean;
  is_liked: boolean;
  primary_category?: { id: number; name: string; slug: string };
  secondary_category?: { id: number; name: string; slug: string };
  package_details?: {
    basic?: { price: number; mrp: number; delivery_time: number };
    standard?: { price: number; mrp: number; delivery_time: number };
    premium?: { price: number; mrp: number; delivery_time: number };
  };
  user?: {
    sub: string;
    first_name: string;
    last_name: string;
    user_name: string;
    profile_image: string;
  };
}

interface MappedService {
  id: string;
  title: string;
  slug: string;
  thumbnail_image: string;
  price: number;
  mrp: number;
  avg_rating: number;
  total_reviews: number;
  total_sales: number;
  is_onsale: boolean;
  is_liked: boolean;
  is_trending: boolean;
  category?: string;
  category_id?: string;
  creator?: {
    full_name: string;
    user_name: string;
    profile_image: string;
  };
}

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
  const [services, setServices] = useState<MappedService[]>([]);
  const [categories, setCategories] = useState<{ id: string; label: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map API service to our format
  const mapService = (item: ApiService): MappedService => ({
    id: item.id,
    title: item.service_title,
    slug: item.slug,
    thumbnail_image: item.thumbnail_image ? `${S3_BUCKET}/${item.thumbnail_image}` : '',
    price: item.package_details?.basic?.price || item.price || 0,
    mrp: item.package_details?.basic?.mrp || item.mrp || 0,
    avg_rating: parseFloat(item.avg_rating) || 0,
    total_reviews: item.total_reviews || 0,
    total_sales: item.total_sales || 0,
    is_onsale: item.is_onsale || false,
    is_liked: item.is_liked || false,
    is_trending: (item.total_sales || 0) > 3,
    category: item.primary_category?.name,
    category_id: item.primary_category?.slug,
    creator: item.user
      ? {
          full_name: `${item.user.first_name} ${item.user.last_name}`,
          user_name: item.user.user_name,
          profile_image: item.user.profile_image ? `${S3_BUCKET}/${item.user.profile_image}` : '',
        }
      : undefined,
  });

  // Fetch services from API
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set('page', '1');
      params.set('limit', '50');

      const response = await fetch(`${API_URL_FEED}/services?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch services');

      const json = await response.json();
      let items: ApiService[] = json.data?.items || [];

      // Map to our format
      let serviceList = items.map(mapService);

      // Set categories from aggregations if available
      if (json.data?.aggregations?.categories) {
        setCategories(
          json.data.aggregations.categories.map((cat: { id: number; name: string; slug: string; item_count: number }) => ({
            id: cat.slug,
            label: cat.name,
            count: cat.item_count || 0,
          }))
        );
      } else {
        // Extract unique categories from services
        const uniqueCategories = new Map<string, { label: string; count: number }>();
        serviceList.forEach((s) => {
          if (s.category_id && s.category) {
            const existing = uniqueCategories.get(s.category_id);
            uniqueCategories.set(s.category_id, {
              label: s.category,
              count: (existing?.count || 0) + 1,
            });
          }
        });
        setCategories(
          Array.from(uniqueCategories.entries()).map(([id, { label, count }]) => ({ id, label, count }))
        );
      }

      // Client-side filters
      if (activeFilters.priceRange) {
        serviceList = serviceList.filter(
          (s) => s.price >= activeFilters.priceRange!.min && s.price <= activeFilters.priceRange!.max
        );
      }

      if (activeFilters.rating) {
        serviceList = serviceList.filter((s) => s.avg_rating >= activeFilters.rating!);
      }

      if (activeFilters.categories.length > 0) {
        serviceList = serviceList.filter((s) =>
          activeFilters.categories.includes(s.category_id || '')
        );
      }

      // Client-side sort
      switch (activeFilters.sortBy) {
        case 'popular':
          serviceList.sort((a, b) => b.total_sales - a.total_sales);
          break;
        case 'price-low':
          serviceList.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          serviceList.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          serviceList.sort((a, b) => b.avg_rating - a.avg_rating);
          break;
      }

      setServices(serviceList);
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
