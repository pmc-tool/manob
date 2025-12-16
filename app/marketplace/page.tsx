// MIGRATION: Marketplace page with LEFT SIDEBAR filter, toggle, products/services grid
'use client';

import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Loader2 } from 'lucide-react';
import { Select } from 'antd';
import { ListingToggle, type ListingType } from '@/components/pmc-migrated/marketplace/listing-toggle';
import { SidebarFilter, type ActiveFilters } from '@/components/pmc-migrated/marketplace/sidebar-filter';
import { ProductCard } from '@/components/pmc-migrated/marketplace/product-card';
import { ServiceCard } from '@/components/pmc-migrated/marketplace/service-card';
import { SearchModal } from '@/components/pmc-migrated/marketplace/search-bar';
import { mockFeaturedServices, mockTrendingServices } from '@/lib/mocks/services.mock';
import { useGetProductsQuery, useGetFilterOptionsQuery } from '@/state/services/home-service/public-product.service';

// Services still use mock data for now
const allServices = [...mockFeaturedServices, ...mockTrendingServices];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
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

  // Fetch filter options from API
  const { data: filterOptions } = useGetFilterOptionsQuery();

  // Map API filter options to sidebar format
  const filterCategories = useMemo(() => {
    const categories = filterOptions?.categories || filterOptions?.primary_categories || [];
    return categories.map((cat: any) => ({
      id: String(cat.id),
      label: cat.name || cat.title,
      count: cat.count || cat.product_count || 0,
    }));
  }, [filterOptions]);

  // Build query params with filters
  const queryParams = useMemo(() => {
    const params: any = {
      page: 1,
      limit: 50
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

  // Fetch products from API with filters
  const {
    data: publicProducts,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
  } = useGetProductsQuery({ queryParams });

  // Map API products to component format
  const apiProducts = useMemo(() => {
    const items = publicProducts?.items || [];
    return items.map((item: any) => ({
      id: item.id,
      title: item.product_name,
      slug: item.slug,
      thumbnail_image: item.image?.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_S3BUCKET}/${item.image}`,
      price: item.price || 0,
      mrp: item.mrp || 0,
      avg_rating: parseFloat(item.avg_rating) || 0,
      total_reviews: item.total_reviews || 0,
      total_sales: item.total_sales || 0,
      is_onsale: item.is_onsale || false,
      is_trending: item.is_trending || false,
      is_liked: item.is_liked || false,
      is_pixi_compatible: item.is_pixi_compatible || false,
      creator: {
        full_name: `${item.user?.first_name || ''} ${item.user?.last_name || ''}`.trim(),
        user_name: item.user?.user_name || '',
        profile_image: item.user?.profile_image || '',
      }
    }));
  }, [publicProducts]);

  // Filter and sort products (API handles category & price, client handles rating & sort)
  const filteredProducts = useMemo(() => {
    let result = [...apiProducts];

    // Rating filter (client-side, API doesn't support it)
    if (activeFilters.rating) {
      result = result.filter((p) => p.avg_rating >= activeFilters.rating!);
    }

    // Sorting (client-side)
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
  }, [apiProducts, activeFilters.rating, sortBy]);

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
    <div className="flex flex-col gap-4 h-full">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900 m-0">Marketplace</h1>
          <ListingToggle activeType={listingType} onToggle={handleToggle} />
        </div>

        <button
          onClick={() => setShowSearch(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-[13px] bg-gray-100 border-none rounded-lg text-gray-500 cursor-pointer transition-colors hover:bg-gray-200"
        >
          <Search size={16} />
          <span className="hidden sm:inline">Search {listingType}...</span>
          <kbd className="px-1.5 py-0.5 text-[11px] bg-white border border-gray-200 rounded text-gray-400">/</kbd>
        </button>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex gap-5 flex-1 min-h-0 flex-col md:flex-row">
        {/* Left Sidebar Filter */}
        <SidebarFilter
          categories={filterCategories}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
        />

        {/* Right Content Area */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <span className="text-sm text-gray-500">
              {currentItems.length} {listingType}
            </span>
            <div className="flex items-center gap-1.5 text-gray-500">
              <ArrowUpDown size={14} />
              <Select
                value={sortBy}
                onChange={(value) => setSortBy(value)}
                options={SORT_OPTIONS}
                size="small"
                style={{ width: 160 }}
                variant="outlined"
              />
            </div>
          </div>

          {/* Grid */}
          {listingType === 'products' && (isLoadingProducts || isFetchingProducts) ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              <span className="ml-3 text-gray-500">Loading products...</span>
            </div>
          ) : currentItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
            <div className="text-center py-12 px-5 bg-gray-50 rounded-xl">
              <p className="text-[15px] text-gray-500 mb-3">No {listingType} found matching your filters.</p>
              <button
                onClick={() =>
                  setActiveFilters({ categories: [], priceRange: null, rating: null })
                }
                className="px-4 py-2 text-[13px] font-medium text-primary bg-transparent border border-primary rounded-lg cursor-pointer transition-all hover:bg-primary hover:text-white"
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
