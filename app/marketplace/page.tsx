// MIGRATION: Marketplace page with LEFT SIDEBAR filter, toggle, products/services grid
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, ArrowUpDown, Loader2 } from 'lucide-react';
import { ListingToggle, type ListingType } from '@/components/pmc-migrated/marketplace/listing-toggle';
import { SidebarFilter, type ActiveFilters } from '@/components/pmc-migrated/marketplace/sidebar-filter';
import { ProductCard } from '@/components/pmc-migrated/marketplace/product-card';
import { ServiceCard } from '@/components/pmc-migrated/marketplace/service-card';
import { SearchModal } from '@/components/pmc-migrated/marketplace/search-bar';
import { handleError } from '@/lib/api/error-handler';
import styles from './page.module.css';

const API_URL_FEED = process.env.NEXT_PUBLIC_API_URL_FEED || '';
const S3_BUCKET = process.env.NEXT_PUBLIC_S3BUCKET || '';

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'popular', label: 'Most Popular' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
];

// Map API response to our Product format
interface ApiProduct {
  id: string;
  product_name: string;
  slug: string;
  image: string;
  price: number;
  mrp: number;
  avg_rating: string;
  total_reviews: number;
  total_sales: number;
  is_onsale: boolean;
  is_liked: boolean;
  short_description: string;
  primary_category?: { id: number; name: string; slug: string };
  secondary_category?: { id: number; name: string; slug: string };
  user?: {
    sub: string;
    first_name: string;
    last_name: string;
    user_name: string;
    profile_image: string;
  };
}

interface MappedProduct {
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
  is_pixi_compatible: boolean;
  creator: string;
  category?: string;
  category_id?: string;
}

export default function MarketplacePage() {
  const [listingType, setListingType] = useState<ListingType>('products');
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categories: [],
    priceRange: null,
    rating: null,
  });

  // Data states
  const [products, setProducts] = useState<MappedProduct[]>([]);
  const [services, setServices] = useState<MappedProduct[]>([]);
  const [categories, setCategories] = useState<{ id: string; label: string; count: number }[]>([]);

  // Loading states
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map API product to our format
  const mapProduct = (item: ApiProduct): MappedProduct => ({
    id: item.id,
    title: item.product_name,
    slug: item.slug,
    thumbnail_image: item.image ? `${S3_BUCKET}/${item.image}` : '',
    price: item.price,
    mrp: item.mrp,
    avg_rating: parseFloat(item.avg_rating) || 0,
    total_reviews: item.total_reviews || 0,
    total_sales: item.total_sales || 0,
    is_onsale: item.is_onsale || false,
    is_liked: item.is_liked || false,
    is_trending: (item.total_sales || 0) > 5,
    is_pixi_compatible: false,
    creator: item.user ? `${item.user.first_name} ${item.user.last_name}` : '',
    category: item.primary_category?.name,
    category_id: item.primary_category?.slug,
  });

  // Fetch products from feed API
  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      setError(null);

      const params = new URLSearchParams();
      params.set('page', '1');
      params.set('limit', '50');

      const response = await fetch(`${API_URL_FEED}/themes?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch');

      const json = await response.json();
      let items: ApiProduct[] = json.data?.items || [];

      // Map to our format
      let productList = items.map(mapProduct);

      // Set categories from aggregations
      if (json.data?.aggregations?.categories) {
        setCategories(
          json.data.aggregations.categories.map((cat: { id: number; name: string; slug: string; item_count: number }) => ({
            id: cat.slug,
            label: cat.name,
            count: cat.item_count || 0,
          }))
        );
      }

      // Client-side filters
      if (activeFilters.priceRange) {
        productList = productList.filter(
          (p) => p.price >= activeFilters.priceRange!.min && p.price <= activeFilters.priceRange!.max
        );
      }

      if (activeFilters.rating) {
        productList = productList.filter((p) => p.avg_rating >= activeFilters.rating!);
      }

      if (activeFilters.categories.length > 0) {
        productList = productList.filter((p) =>
          activeFilters.categories.includes(p.category_id || '')
        );
      }

      // Client-side sort
      switch (sortBy) {
        case 'popular':
          productList.sort((a, b) => b.total_sales - a.total_sales);
          break;
        case 'price-low':
          productList.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          productList.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          productList.sort((a, b) => b.avg_rating - a.avg_rating);
          break;
      }

      setProducts(productList);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [sortBy, activeFilters]);

  // Fetch services (using same endpoint for now, can be changed later)
  const fetchServices = useCallback(async () => {
    try {
      setLoadingServices(true);
      setError(null);

      // TODO: Replace with actual services endpoint when available
      const response = await fetch(`${API_URL_FEED}/themes?page=1&limit=50`);
      if (!response.ok) throw new Error('Failed to fetch');

      const json = await response.json();
      let items: ApiProduct[] = json.data?.items || [];

      let serviceList = items.map(mapProduct);

      // Client-side filters
      if (activeFilters.priceRange) {
        serviceList = serviceList.filter(
          (s) => s.price >= activeFilters.priceRange!.min && s.price <= activeFilters.priceRange!.max
        );
      }

      if (activeFilters.rating) {
        serviceList = serviceList.filter((s) => s.avg_rating >= activeFilters.rating!);
      }

      // Client-side sort
      switch (sortBy) {
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
      setLoadingServices(false);
    }
  }, [sortBy, activeFilters]);

  // Fetch data when listing type, sort, or filters change
  useEffect(() => {
    if (listingType === 'products') {
      fetchProducts();
    } else {
      fetchServices();
    }
  }, [listingType, fetchProducts, fetchServices]);

  const currentItems = listingType === 'products' ? products : services;
  const isLoading = listingType === 'products' ? loadingProducts : loadingServices;

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
          categories={categories}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
        />

        {/* Right Content Area */}
        <div className={styles.contentArea}>
          {/* Sort Bar */}
          <div className={styles.sortBar}>
            <span className={styles.resultCount}>
              {isLoading ? 'Loading...' : `${currentItems.length} ${listingType}`}
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

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className={styles.emptyState}>
              <p>{error}</p>
              <button onClick={listingType === 'products' ? fetchProducts : fetchServices}>
                Try again
              </button>
            </div>
          )}

          {/* Grid */}
          {!isLoading && !error && currentItems.length > 0 && (
            <div className={styles.grid}>
              {listingType === 'products'
                ? products.map((product) => (
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
                : services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      id={service.id}
                      slug={service.slug}
                      img={service.thumbnail_image}
                      author={service.creator}
                      authorProfileLink="#"
                      category={service.category}
                      categoryId={service.category_id}
                      title={service.title}
                      rating={service.avg_rating}
                      reviews={service.total_reviews}
                      authorImg=""
                      authorName={service.creator}
                      price={service.price}
                      discountPrice={service.mrp && service.mrp < service.price ? service.mrp : 0}
                      isOnSale={service.is_onsale}
                      trendingStatus={service.is_trending}
                      is_liked={service.is_liked}
                      isPixiCompatible={service.is_pixi_compatible}
                    />
                  ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && currentItems.length === 0 && (
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
