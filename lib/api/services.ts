// CONTRACT: Service API endpoints for PMC marketplace
// MIGRATION: Centralized service API module with proper types

import { API_URL_FEED, API_URL_INV, getAccessToken } from './client';
import type { PaginationRequest, Pagination, ReviewListResponse } from './types';

const S3_BUCKET = process.env.NEXT_PUBLIC_S3BUCKET || '';

// ============================================
// API Response Types (from FEED microservice)
// ============================================

export interface ApiServiceCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ApiServicePackage {
  title: string;
  price: number;
  mrp: number;
  short_description: string;
  delivery_time: number;
}

export interface ApiServiceUser {
  sub: string;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  profile_image: string;
}

export interface ApiService {
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
  updated_at: string;
  created_at?: string;
  primary_category?: ApiServiceCategory;
  secondary_category?: ApiServiceCategory;
  package_details?: {
    basic?: ApiServicePackage;
    standard?: ApiServicePackage;
    premium?: ApiServicePackage;
  };
  user?: ApiServiceUser;
  tags?: string[];
  faqs?: Array<{ question: string; answer: string }>;
}

export interface ApiServiceAggregations {
  categories?: Array<{
    id: number;
    name: string;
    slug: string;
    item_count: number;
  }>;
}

export interface ApiServiceListResponse {
  data: {
    items: ApiService[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
    aggregations?: ApiServiceAggregations;
  };
}

// ============================================
// Mapped Types (for components)
// ============================================

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  deliveryDays: number;
  revisions: number | 'Unlimited';
  features: string[];
}

export interface ServiceSeller {
  id: string;
  first_name: string;
  last_name: string;
  user_name: string;
  profile_image: string;
  member_since: string;
  country: string;
  languages: string[];
  response_time: string;
  last_delivery: string;
  description: string;
  level: string;
  total_reviews: number;
  avg_rating: number;
  completed_orders: number;
  badges: Array<{ badge_icon: string; badge_name: string }>;
}

export interface ServiceListItem {
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

export interface ServiceDetails {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryId: string;
  subcategory?: string;
  short_description: string;
  full_description: string;
  gallery_images: string[];
  video_url?: string;
  packages: ServicePackage[];
  total_orders: number;
  total_views: number;
  total_likes: number;
  is_liked: boolean;
  avg_rating: number;
  total_reviews: number;
  response_time: string;
  current_status: string;
  tags: string[];
  faqs: Array<{ question: string; answer: string }>;
  created_at: string;
  updated_at: string;
  seller: ServiceSeller;
}

export interface ServiceListResponse {
  services: ServiceListItem[];
  pagination: Pagination;
  categories: Array<{ id: string; label: string; count: number }>;
}

export interface ServiceFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'newest' | 'popular' | 'price-low' | 'price-high' | 'rating';
  search?: string;
}

// ============================================
// Helper Functions
// ============================================

function prefixS3Url(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${S3_BUCKET}/${path}`;
}

function mapApiServiceToListItem(item: ApiService): ServiceListItem {
  return {
    id: item.id,
    title: item.service_title,
    slug: item.slug,
    thumbnail_image: prefixS3Url(item.thumbnail_image),
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
          full_name: `${item.user.first_name} ${item.user.last_name}`.trim(),
          user_name: item.user.user_name,
          profile_image: prefixS3Url(item.user.profile_image),
        }
      : undefined,
  };
}

function mapApiServiceToDetails(item: ApiService): ServiceDetails {
  const packages: ServicePackage[] = [];

  if (item.package_details?.basic && item.package_details.basic.price > 0) {
    packages.push({
      id: 'basic',
      name: item.package_details.basic.title || 'Basic',
      description: item.package_details.basic.short_description || 'Basic package',
      price: item.package_details.basic.price,
      oldPrice:
        item.package_details.basic.mrp !== item.package_details.basic.price
          ? item.package_details.basic.mrp
          : undefined,
      deliveryDays: item.package_details.basic.delivery_time || 3,
      revisions: 2,
      features: (item.package_details.basic.short_description || '')
        .split('\n')
        .filter(Boolean),
    });
  }

  if (item.package_details?.standard && item.package_details.standard.price > 0) {
    packages.push({
      id: 'standard',
      name: item.package_details.standard.title || 'Standard',
      description: item.package_details.standard.short_description || 'Standard package',
      price: item.package_details.standard.price,
      oldPrice:
        item.package_details.standard.mrp !== item.package_details.standard.price
          ? item.package_details.standard.mrp
          : undefined,
      deliveryDays: item.package_details.standard.delivery_time || 7,
      revisions: 5,
      features: (item.package_details.standard.short_description || '')
        .split('\n')
        .filter(Boolean),
    });
  }

  if (item.package_details?.premium && item.package_details.premium.price > 0) {
    packages.push({
      id: 'premium',
      name: item.package_details.premium.title?.trim() || 'Premium',
      description: item.package_details.premium.short_description || 'Premium package',
      price: item.package_details.premium.price,
      oldPrice:
        item.package_details.premium.mrp !== item.package_details.premium.price
          ? item.package_details.premium.mrp
          : undefined,
      deliveryDays: item.package_details.premium.delivery_time || 14,
      revisions: 'Unlimited' as const,
      features: (item.package_details.premium.short_description || '')
        .split('\n')
        .filter(Boolean),
    });
  }

  return {
    id: item.id,
    slug: item.slug,
    title: item.service_title,
    category: item.primary_category?.name || '',
    categoryId: item.primary_category?.slug || '',
    subcategory: item.secondary_category?.name,
    short_description: item.package_details?.basic?.short_description || '',
    full_description: `
      <h3>About This Service</h3>
      <p>${item.package_details?.basic?.short_description || 'Professional service offered by experienced provider.'}</p>

      <h3>What You'll Get</h3>
      <ul>
        ${item.package_details?.basic ? `<li><strong>Basic Package:</strong> ${item.package_details.basic.short_description?.replace(/\n/g, ', ') || 'Essential features'}</li>` : ''}
        ${item.package_details?.standard ? `<li><strong>Standard Package:</strong> ${item.package_details.standard.short_description?.replace(/\n/g, ', ') || 'Extended features'}</li>` : ''}
        ${item.package_details?.premium ? `<li><strong>Premium Package:</strong> ${item.package_details.premium.short_description?.replace(/\n/g, ', ') || 'Complete solution'}</li>` : ''}
      </ul>
    `,
    gallery_images: item.thumbnail_image ? [prefixS3Url(item.thumbnail_image)] : [],
    packages,
    total_orders: item.total_sales || 0,
    total_views: 0,
    total_likes: 0,
    is_liked: item.is_liked || false,
    avg_rating: parseFloat(item.avg_rating) || 0,
    total_reviews: item.total_reviews || 0,
    response_time: '1 hour',
    current_status: 'PUBLISHED',
    tags: item.tags || [],
    faqs: item.faqs || [],
    created_at: item.created_at || item.updated_at,
    updated_at: item.updated_at,
    seller: {
      id: item.user?.sub || '',
      first_name: item.user?.first_name || '',
      last_name: item.user?.last_name || '',
      user_name: item.user?.user_name || '',
      profile_image: prefixS3Url(item.user?.profile_image),
      member_since: '',
      country: '',
      languages: ['English'],
      response_time: '1 hour',
      last_delivery: '',
      description: '',
      level: 'Level 2 Seller',
      total_reviews: item.total_reviews || 0,
      avg_rating: parseFloat(item.avg_rating) || 0,
      completed_orders: item.total_sales || 0,
      badges: [],
    },
  };
}

function applySorting(services: ServiceListItem[], sortBy: string): ServiceListItem[] {
  const sorted = [...services];
  switch (sortBy) {
    case 'popular':
      sorted.sort((a, b) => b.total_sales - a.total_sales);
      break;
    case 'price-low':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      sorted.sort((a, b) => b.avg_rating - a.avg_rating);
      break;
    case 'newest':
    default:
      // Already sorted by API (newest first)
      break;
  }
  return sorted;
}

// ============================================
// API Functions
// ============================================

/**
 * Get services with filters and pagination
 * Uses FEED microservice for listing
 */
export async function getServices(filters: ServiceFilters = {}): Promise<ServiceListResponse> {
  const params = new URLSearchParams();
  params.set('page', String(filters.page || 1));
  params.set('limit', String(filters.limit || 50));

  if (filters.search) {
    params.set('search', filters.search);
  }
  if (filters.categoryId) {
    params.set('category', filters.categoryId);
  }

  const response = await fetch(`${API_URL_FEED}/services?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch services: ${response.statusText}`);
  }

  const json: ApiServiceListResponse = await response.json();
  const items = json.data?.items || [];

  // Map to component format
  let services = items.map(mapApiServiceToListItem);

  // Extract categories from aggregations or services
  let categories: Array<{ id: string; label: string; count: number }> = [];
  if (json.data?.aggregations?.categories) {
    categories = json.data.aggregations.categories.map((cat) => ({
      id: cat.slug,
      label: cat.name,
      count: cat.item_count || 0,
    }));
  } else {
    const uniqueCategories = new Map<string, { label: string; count: number }>();
    services.forEach((s) => {
      if (s.category_id && s.category) {
        const existing = uniqueCategories.get(s.category_id);
        uniqueCategories.set(s.category_id, {
          label: s.category,
          count: (existing?.count || 0) + 1,
        });
      }
    });
    categories = Array.from(uniqueCategories.entries()).map(([id, { label, count }]) => ({
      id,
      label,
      count,
    }));
  }

  // Apply client-side filters (API doesn't support all filters)
  if (filters.minPrice !== undefined) {
    services = services.filter((s) => s.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    services = services.filter((s) => s.price <= filters.maxPrice!);
  }
  if (filters.minRating !== undefined) {
    services = services.filter((s) => s.avg_rating >= filters.minRating!);
  }
  if (filters.categoryId) {
    services = services.filter((s) => s.category_id === filters.categoryId);
  }

  // Apply sorting
  if (filters.sortBy) {
    services = applySorting(services, filters.sortBy);
  }

  const apiPagination = json.data?.pagination;
  const pagination: Pagination = {
    page: apiPagination?.page || filters.page || 1,
    limit: apiPagination?.limit || filters.limit || 50,
    total: apiPagination?.total || services.length,
    totalPages: apiPagination?.total_pages || Math.ceil(services.length / (filters.limit || 50)),
    hasNext: apiPagination ? apiPagination.page < apiPagination.total_pages : false,
    hasPrev: apiPagination ? apiPagination.page > 1 : false,
  };

  return { services, pagination, categories };
}

/**
 * Get service by slug
 * Searches services and finds exact match
 */
export async function getServiceBySlug(slug: string): Promise<ServiceDetails | null> {
  // Search for service by slug keywords
  const searchQuery = slug.replace(/-/g, ' ').slice(0, 50);
  const params = new URLSearchParams();
  params.set('search', searchQuery);
  params.set('limit', '50');

  const response = await fetch(`${API_URL_FEED}/services?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch service: ${response.statusText}`);
  }

  const json: ApiServiceListResponse = await response.json();
  const items = json.data?.items || [];

  // Find exact match by slug
  const service = items.find((item) => item.slug === slug);
  if (!service) {
    return null;
  }

  return mapApiServiceToDetails(service);
}

/**
 * Get service by ID
 * Uses inventory service
 */
export async function getServiceById(id: string): Promise<ServiceDetails | null> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL_INV}/services/${id}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch service: ${response.statusText}`);
  }

  const service: ApiService = await response.json();
  return mapApiServiceToDetails(service);
}

/**
 * Get related services (excludes current service)
 */
export async function getRelatedServices(
  currentServiceId: string,
  categoryId?: string,
  limit: number = 4
): Promise<ServiceListItem[]> {
  const params = new URLSearchParams();
  params.set('limit', String(limit + 1)); // Fetch one extra in case current is included
  if (categoryId) {
    params.set('category', categoryId);
  }

  const response = await fetch(`${API_URL_FEED}/services?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    return [];
  }

  const json: ApiServiceListResponse = await response.json();
  const items = json.data?.items || [];

  return items
    .filter((item) => item.id !== currentServiceId)
    .slice(0, limit)
    .map(mapApiServiceToListItem);
}

/**
 * Get service reviews
 * Uses inventory service
 */
export async function getServiceReviews(
  serviceId: string,
  params?: PaginationRequest
): Promise<ReviewListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  const query = searchParams.toString();

  const token = getAccessToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL_INV}/services/${serviceId}/reviews${query ? `?${query}` : ''}`,
    {
      method: 'GET',
      headers,
    }
  );

  if (!response.ok) {
    // Return empty reviews on error
    return {
      reviews: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  return response.json();
}

/**
 * Toggle service like status
 */
export async function toggleServiceLike(serviceId: string): Promise<{ is_liked: boolean }> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL_INV}/services/${serviceId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to toggle like: ${response.statusText}`);
  }

  return response.json();
}

// Default export for convenience
const servicesApi = {
  getServices,
  getServiceBySlug,
  getServiceById,
  getRelatedServices,
  getServiceReviews,
  toggleServiceLike,
};

export default servicesApi;
