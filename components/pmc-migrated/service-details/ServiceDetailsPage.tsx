// Service Details Page - Main component (matching original PMC design)
'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileText, MessageSquare, Star, Info, Loader2 } from 'lucide-react';
import ServiceHeader from './ServiceHeader';
import ServiceGallery from './ServiceGallery';
import ServiceDescription from './ServiceDescription';
import ServiceFAQ from './ServiceFAQ';
import ServicePackages from './ServicePackages';
import SellerCard from './SellerCard';
import ServiceSocialShare from './ServiceSocialShare';
import ServiceReviews from './ServiceReviews';
import RelatedServicesCarousel from './RelatedServicesCarousel';
import {
  ServiceData,
  ServiceReview,
  mockRelatedServices,
  PackageTab,
  PackagesComparisonInfo,
} from '@/lib/mocks/service-details.mock';
import PackageComparisonTable from './PackageComparisonTable';

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
  updated_at: string;
  primary_category?: { id: number; name: string; slug: string };
  secondary_category?: { id: number; name: string; slug: string };
  package_details?: {
    basic?: { title: string; price: number; mrp: number; short_description: string; delivery_time: number };
    standard?: { title: string; price: number; mrp: number; short_description: string; delivery_time: number };
    premium?: { title: string; price: number; mrp: number; short_description: string; delivery_time: number };
  };
  user?: {
    sub: string;
    first_name: string;
    last_name: string;
    user_name: string;
    email: string;
    profile_image: string;
  };
}

interface ServiceDetailsPageProps {
  slug: string;
}

export default function ServiceDetailsPage({ slug }: ServiceDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'faq'>('description');
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewFilter, setReviewFilter] = useState('newest');

  // Data states
  const [service, setService] = useState<ServiceData | null>(null);
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [relatedServices, setRelatedServices] = useState<typeof mockRelatedServices>([]);
  const [reviewStats, setReviewStats] = useState({ avg_rating: 0, total_reviews: 0, rating_sequence: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [packageTabs, setPackageTabs] = useState<PackageTab[]>([]);
  const [packagesComparisonInfo, setPackagesComparisonInfo] = useState<PackagesComparisonInfo | null>(null);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is owner (mock for now)
  const isOwner = false;
  const isHiddenItem = service?.current_status !== 'PUBLISHED';

  // Fetch service data
  const fetchServiceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Search for service by slug
      const searchQuery = slug.replace(/-/g, ' ').slice(0, 50);
      const feedResponse = await fetch(`${API_URL_FEED}/services?search=${encodeURIComponent(searchQuery)}&limit=50`);
      if (!feedResponse.ok) throw new Error('Failed to fetch service');

      const feedJson = await feedResponse.json();
      const feedItems: ApiService[] = feedJson.data?.items || [];

      // Find exact match by slug
      const apiService = feedItems.find((item) => item.slug === slug);
      if (!apiService) throw new Error('Service not found');

      // Map API data to ServiceData
      const mappedService: ServiceData = {
        id: apiService.id,
        slug: apiService.slug,
        title: apiService.service_title,
        category: apiService.primary_category?.name || '',
        categoryId: apiService.primary_category?.slug || '',
        subcategory: apiService.secondary_category?.name,
        short_description: apiService.package_details?.basic?.short_description || '',
        full_description: `
          <h3>About This Service</h3>
          <p>${apiService.package_details?.basic?.short_description || 'Professional service offered by experienced provider.'}</p>

          <h3>What You'll Get</h3>
          <ul>
            <li><strong>Basic Package:</strong> ${apiService.package_details?.basic?.short_description?.replace(/\n/g, ', ') || 'Essential features'}</li>
            <li><strong>Standard Package:</strong> ${apiService.package_details?.standard?.short_description?.replace(/\n/g, ', ') || 'Extended features'}</li>
            <li><strong>Premium Package:</strong> ${apiService.package_details?.premium?.short_description?.replace(/\n/g, ', ') || 'Complete solution'}</li>
          </ul>
        `,
        gallery_images: apiService.thumbnail_image ? [`${S3_BUCKET}/${apiService.thumbnail_image}`] : [],
        packages: [
          {
            id: 'basic',
            name: apiService.package_details?.basic?.title || 'Basic',
            description: apiService.package_details?.basic?.short_description || 'Basic package',
            price: apiService.package_details?.basic?.price || apiService.price || 0,
            oldPrice: apiService.package_details?.basic?.mrp !== apiService.package_details?.basic?.price ? apiService.package_details?.basic?.mrp : undefined,
            deliveryDays: apiService.package_details?.basic?.delivery_time || 3,
            revisions: 2,
            features: (apiService.package_details?.basic?.short_description || '').split('\n').filter(Boolean),
          },
          {
            id: 'standard',
            name: apiService.package_details?.standard?.title || 'Standard',
            description: apiService.package_details?.standard?.short_description || 'Standard package',
            price: apiService.package_details?.standard?.price || 0,
            oldPrice: apiService.package_details?.standard?.mrp !== apiService.package_details?.standard?.price ? apiService.package_details?.standard?.mrp : undefined,
            deliveryDays: apiService.package_details?.standard?.delivery_time || 7,
            revisions: 5,
            features: (apiService.package_details?.standard?.short_description || '').split('\n').filter(Boolean),
          },
          {
            id: 'premium',
            name: apiService.package_details?.premium?.title?.trim() || 'Premium',
            description: apiService.package_details?.premium?.short_description || 'Premium package',
            price: apiService.package_details?.premium?.price || 0,
            oldPrice: apiService.package_details?.premium?.mrp !== apiService.package_details?.premium?.price ? apiService.package_details?.premium?.mrp : undefined,
            deliveryDays: apiService.package_details?.premium?.delivery_time || 14,
            revisions: 'Unlimited' as const,
            features: (apiService.package_details?.premium?.short_description || '').split('\n').filter(Boolean),
          },
        ].filter((pkg) => pkg.price > 0),
        total_orders: apiService.total_sales || 0,
        total_views: 0,
        total_likes: 0,
        is_liked: apiService.is_liked || false,
        avg_rating: parseFloat(apiService.avg_rating) || 0,
        total_reviews: apiService.total_reviews || 0,
        response_time: '1 hour',
        current_status: 'PUBLISHED',
        tags: [],
        faqs: [],
        created_at: apiService.updated_at,
        updated_at: apiService.updated_at,
        seller: {
          id: apiService.user?.sub || '',
          first_name: apiService.user?.first_name || '',
          last_name: apiService.user?.last_name || '',
          user_name: apiService.user?.user_name || '',
          profile_image: apiService.user?.profile_image ? `${S3_BUCKET}/${apiService.user.profile_image}` : '',
          member_since: '',
          country: '',
          languages: ['English'],
          response_time: '1 hour',
          last_delivery: '',
          description: '',
          level: 'Level 2 Seller',
          total_reviews: apiService.total_reviews || 0,
          avg_rating: parseFloat(apiService.avg_rating) || 0,
          completed_orders: apiService.total_sales || 0,
          badges: [],
        },
      };

      // Set review stats
      const mappedReviewStats = {
        avg_rating: parseFloat(apiService.avg_rating) || 0,
        total_reviews: apiService.total_reviews || 0,
        rating_sequence: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };

      // Build package tabs for comparison table
      const mappedPackageTabs: PackageTab[] = mappedService.packages.map((pkg) => ({
        id: pkg.id as 'basic' | 'standard' | 'premium',
        title: pkg.name,
      }));

      // Build packages comparison info - map to ComparisonPackageInfo interface
      const mappedPackagesComparisonInfo: PackagesComparisonInfo = {
        basic: {
          title: mappedService.packages[0]?.name || 'Basic',
          price: mappedService.packages[0]?.price || 0,
          short_description: mappedService.packages[0]?.description || '',
          delivery_time: mappedService.packages[0]?.deliveryDays || 3,
          attributes: mappedService.packages[0]?.features?.map((f: string) => ({ key: f, value: true })) || [],
        },
        standard: mappedService.packages[1] ? {
          title: mappedService.packages[1].name,
          price: mappedService.packages[1].price,
          short_description: mappedService.packages[1].description,
          delivery_time: mappedService.packages[1].deliveryDays,
          attributes: mappedService.packages[1].features?.map((f: string) => ({ key: f, value: true })) || [],
        } : undefined,
        premium: mappedService.packages[2] ? {
          title: mappedService.packages[2].name,
          price: mappedService.packages[2].price,
          short_description: mappedService.packages[2].description,
          delivery_time: mappedService.packages[2].deliveryDays,
          attributes: mappedService.packages[2].features?.map((f: string) => ({ key: f, value: true })) || [],
        } : undefined,
      };

      // Fetch related services
      const relatedResponse = await fetch(`${API_URL_FEED}/services?limit=4`);
      let relatedItems: ApiService[] = [];
      if (relatedResponse.ok) {
        const relatedJson = await relatedResponse.json();
        relatedItems = (relatedJson.data?.items || []).filter((item: ApiService) => item.id !== apiService.id).slice(0, 4);
      }

      const mappedRelated = relatedItems.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.service_title,
        img: item.thumbnail_image ? `${S3_BUCKET}/${item.thumbnail_image}` : '',
        authorName: `${item.user?.first_name || ''} ${item.user?.last_name || ''}`.trim(),
        price: item.package_details?.basic?.price || item.price || 0,
        rating: parseFloat(item.avg_rating) || 0,
        reviews: item.total_reviews || 0,
      }));

      // Set all states
      setService(mappedService);
      setReviewStats(mappedReviewStats);
      setPackageTabs(mappedPackageTabs);
      setPackagesComparisonInfo(mappedPackagesComparisonInfo);
      setRelatedServices(mappedRelated);
      setReviews([]);
    } catch (err) {
      console.error('Failed to fetch service:', err);
      setError(err instanceof Error ? err.message : 'Failed to load service');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchServiceData();
    }
  }, [slug, fetchServiceData]);

  // Loading state
  if (loading) {
    return (
      <section className="pt-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-3 text-gray-500">Loading service details...</span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || !service) {
    return (
      <section className="pt-4">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {error || 'Service not found'}
            </h2>
            <p className="text-gray-500 mb-4">
              The service you&apos;re looking for could not be loaded.
            </p>
            <button
              onClick={fetchServiceData}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const handleOrderNow = (packageId: string) => {
    console.log('Order now:', packageId);
  };

  const handleAddToCart = (packageId: string) => {
    console.log('Add to cart:', packageId);
  };

  const handleLikeClick = (isLiked: boolean) => {
    console.log('Like clicked, current status:', isLiked);
  };

  const handleContactSeller = () => {
    console.log('Contact seller clicked');
  };

  return (
    <>
      <section className="pt-4 pb-8">
        <div className="container mx-auto px-4">
          {/* Owner notification */}
          {isOwner && (
            <div className="alert alert-warning flex items-start gap-3 mb-4">
              <Info className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="fz18 font-semibold mb-1">This service is yours!</h5>
                <p className="fz14">
                  You have created this service! Please review and take necessary action.
                </p>
              </div>
            </div>
          )}

          {/* Hidden item notification */}
          {isHiddenItem && (
            <div className="alert alert-primary flex items-start gap-3 mb-4">
              <Info className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="fz18 font-semibold mb-1">This service is currently hidden!</h5>
                <p className="fz14">
                  Before you can put this service on sale, it needs to be reviewed.
                </p>
              </div>
            </div>
          )}

          {/* Main Layout */}
          <div className="product-details-layout">
            {/* Main Content - Left Column */}
            <div className="product-details-main">
              {/* Service Header */}
              <ServiceHeader
                title={service.title}
                category={service.category}
                categoryId={service.categoryId}
                subcategory={service.subcategory}
                sellerName={`${service.seller.first_name} ${service.seller.last_name}`}
                sellerUsername={service.seller.user_name}
                avgRating={service.avg_rating}
                totalReviews={service.total_reviews}
                totalOrders={service.total_orders}
                totalViews={service.total_views}
                responseTime={service.response_time}
              />

              {/* Service Gallery */}
              <ServiceGallery
                images={service.gallery_images}
                videoUrl={service.video_url}
                title={service.title}
              />

              {/* Tabs Navigation */}
              <ul className="item-details-tabs mb-6">
                <li className="nav-item">
                  <button
                    type="button"
                    onClick={() => setActiveTab('description')}
                    className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                  >
                    <FileText className="h-4 w-4" />
                    Description
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    onClick={() => setActiveTab('reviews')}
                    className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                  >
                    <Star className="h-4 w-4" />
                    Reviews
                    <span className="badge">{reviewStats.total_reviews}</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    onClick={() => setActiveTab('faq')}
                    className={`nav-link ${activeTab === 'faq' ? 'active' : ''}`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    FAQ
                  </button>
                </li>
              </ul>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'description' && (
                  <>
                    <ServiceDescription
                      shortDescription={service.short_description}
                      fullDescription={service.full_description}
                    />

                    {/* Package Comparison Table */}
                    {packagesComparisonInfo && (
                      <PackageComparisonTable
                        tabs={packageTabs}
                        packagesInfo={packagesComparisonInfo}
                      />
                    )}

                    {/* Tags */}
                    {service.tags && service.tags.length > 0 && (
                      <div className="service-tags mb-6">
                        <h4 className="fz16 font-semibold mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'reviews' && (
                  <ServiceReviews
                    reviews={reviews}
                    avgRating={reviewStats.avg_rating}
                    totalReviews={reviewStats.total_reviews}
                    ratingSequence={reviewStats.rating_sequence}
                    currentPage={reviewPage}
                    totalPages={1}
                    onPageChange={setReviewPage}
                    onFilterChange={setReviewFilter}
                  />
                )}

                {activeTab === 'faq' && <ServiceFAQ faqs={service.faqs} />}
              </div>
            </div>

            {/* Sidebar - Right Column */}
            <div className="product-details-sidebar">
              {/* Social Share */}
              <ServiceSocialShare
                shareTitle="Share This Service"
                shareDescription="Share this service with your network!"
                totalLikes={service.total_likes}
                isLiked={service.is_liked}
                serviceId={service.id}
                onLikeClick={handleLikeClick}
              />

              {/* Packages */}
              <ServicePackages
                packages={service.packages}
                onOrderNow={handleOrderNow}
                onAddToCart={handleAddToCart}
              />

              {/* Seller Card */}
              <SellerCard seller={service.seller} onContactClick={handleContactSeller} />
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices && relatedServices.length > 0 && (
        <RelatedServicesCarousel
          title="You may also like"
          linkHref="/service-list"
          linkText="Browse All Services"
          services={relatedServices}
        />
      )}
    </>
  );
}
