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
  ServiceReview,
  PackageTab,
  PackagesComparisonInfo,
} from '@/lib/mocks/service-details.mock';
import PackageComparisonTable from './PackageComparisonTable';
import {
  getServiceBySlug,
  getRelatedServices,
  type ServiceDetails,
  type ServiceListItem,
} from '@/lib/api/services';

interface ServiceDetailsPageProps {
  slug: string;
}

// Related service type for carousel
interface RelatedService {
  id: string;
  slug: string;
  title: string;
  img: string;
  authorName: string;
  price: number;
  rating: number;
  reviews: number;
}

export default function ServiceDetailsPage({ slug }: ServiceDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'faq'>('description');
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewFilter, setReviewFilter] = useState('newest');

  // Data states
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [relatedServices, setRelatedServices] = useState<RelatedService[]>([]);
  const [reviewStats, setReviewStats] = useState({ avg_rating: 0, total_reviews: 0, rating_sequence: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [packageTabs, setPackageTabs] = useState<PackageTab[]>([]);
  const [packagesComparisonInfo, setPackagesComparisonInfo] = useState<PackagesComparisonInfo | null>(null);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is owner (mock for now)
  const isOwner = false;
  const isHiddenItem = service?.current_status !== 'PUBLISHED';

  // Fetch service data using centralized API
  const fetchServiceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch service by slug using centralized API
      const serviceData = await getServiceBySlug(slug);
      if (!serviceData) {
        throw new Error('Service not found');
      }

      // Set review stats
      const mappedReviewStats = {
        avg_rating: serviceData.avg_rating,
        total_reviews: serviceData.total_reviews,
        rating_sequence: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };

      // Build package tabs for comparison table
      const mappedPackageTabs: PackageTab[] = serviceData.packages.map((pkg) => ({
        id: pkg.id as 'basic' | 'standard' | 'premium',
        title: pkg.name,
      }));

      // Build packages comparison info
      const mappedPackagesComparisonInfo: PackagesComparisonInfo = {
        basic: serviceData.packages[0]
          ? {
              title: serviceData.packages[0].name,
              price: serviceData.packages[0].price,
              short_description: serviceData.packages[0].description,
              delivery_time: serviceData.packages[0].deliveryDays,
              attributes: serviceData.packages[0].features?.map((f) => ({ key: f, value: true })) || [],
            }
          : undefined,
        standard: serviceData.packages[1]
          ? {
              title: serviceData.packages[1].name,
              price: serviceData.packages[1].price,
              short_description: serviceData.packages[1].description,
              delivery_time: serviceData.packages[1].deliveryDays,
              attributes: serviceData.packages[1].features?.map((f) => ({ key: f, value: true })) || [],
            }
          : undefined,
        premium: serviceData.packages[2]
          ? {
              title: serviceData.packages[2].name,
              price: serviceData.packages[2].price,
              short_description: serviceData.packages[2].description,
              delivery_time: serviceData.packages[2].deliveryDays,
              attributes: serviceData.packages[2].features?.map((f) => ({ key: f, value: true })) || [],
            }
          : undefined,
      };

      // Fetch related services using centralized API
      const relatedItems = await getRelatedServices(serviceData.id, serviceData.categoryId, 4);
      const mappedRelated: RelatedService[] = relatedItems.map((item: ServiceListItem) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        img: item.thumbnail_image,
        authorName: item.creator?.full_name || '',
        price: item.price,
        rating: item.avg_rating,
        reviews: item.total_reviews,
      }));

      // Set all states
      setService(serviceData);
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
                <h5 className="text-lg font-semibold mb-1">This service is yours!</h5>
                <p className="text-sm">
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
                <h5 className="text-lg font-semibold mb-1">This service is currently hidden!</h5>
                <p className="text-sm">
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
              <ul className="flex bg-[#222222] rounded-lg overflow-hidden list-none p-0 m-0 mb-6">
                <li className="flex-1 border-r border-[#393939] last:border-r-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('description')}
                    className={`inline-flex items-center justify-center gap-2 py-3.5 px-4 w-full bg-transparent border-none font-medium text-sm cursor-pointer transition-all whitespace-nowrap leading-normal ${activeTab === 'description' ? 'bg-primary text-white' : 'text-[#a9a9a9] hover:text-white hover:bg-primary'}`}
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    Description
                  </button>
                </li>
                <li className="flex-1 border-r border-[#393939] last:border-r-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('reviews')}
                    className={`inline-flex items-center justify-center gap-2 py-3.5 px-4 w-full bg-transparent border-none font-medium text-sm cursor-pointer transition-all whitespace-nowrap leading-normal ${activeTab === 'reviews' ? 'bg-primary text-white' : 'text-[#a9a9a9] hover:text-white hover:bg-primary'}`}
                  >
                    <Star className="h-4 w-4 shrink-0" />
                    Reviews
                    <span className={`px-2 py-0.5 rounded-xl text-xs leading-none ${activeTab === 'reviews' ? 'bg-white text-primary' : 'bg-white/20 text-white'}`}>{reviewStats.total_reviews}</span>
                  </button>
                </li>
                <li className="flex-1 border-r border-[#393939] last:border-r-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('faq')}
                    className={`inline-flex items-center justify-center gap-2 py-3.5 px-4 w-full bg-transparent border-none font-medium text-sm cursor-pointer transition-all whitespace-nowrap leading-normal ${activeTab === 'faq' ? 'bg-primary text-white' : 'text-[#a9a9a9] hover:text-white hover:bg-primary'}`}
                  >
                    <MessageSquare className="h-4 w-4 shrink-0" />
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
                        <h4 className="text-base font-semibold mb-3">Tags</h4>
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
