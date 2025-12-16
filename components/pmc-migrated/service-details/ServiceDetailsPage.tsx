// Service Details Page - Uses RTK Query for data fetching
'use client';

import { useState, useMemo } from 'react';
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
  PackageTab,
  PackagesComparisonInfo,
} from '@/lib/mocks/service-details.mock';
import PackageComparisonTable from './PackageComparisonTable';
import {
  useGetServicesQuery,
  useGetRecommendedServicesQuery,
  useGetRelatedServicesQuery,
} from '@/state/services/home-service/public-service.service';

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

const S3_BUCKET = process.env.NEXT_PUBLIC_S3BUCKET || 'https://ds.packmycode.com';
const PLACEHOLDER_IMAGE = 'https://picsum.photos/800/450?grayscale';

function prefixS3Url(path: string | undefined | null, usePlaceholder = true): string {
  if (!path) return usePlaceholder ? PLACEHOLDER_IMAGE : '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${S3_BUCKET}/${cleanPath}`;
}

export default function ServiceDetailsPage({ slug }: ServiceDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'faq'>('description');
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewFilter, setReviewFilter] = useState('newest');

  // Convert slug to search query
  const searchQuery = slug.replace(/-/g, ' ').slice(0, 50);

  // Fetch services using search to find by slug
  const {
    data: servicesData,
    isLoading: serviceLoading,
    error: serviceError,
    refetch: refetchService,
  } = useGetServicesQuery({
    queryParams: {
      page: 1,
      limit: 50,
      slug: slug,
    },
  });

  // Find the service that matches the slug
  const service = useMemo(() => {
    if (!servicesData?.items) return null;
    return servicesData.items.find((item: any) => item.slug === slug) || null;
  }, [servicesData, slug]);

  // Fetch related services by ID (or fallback to recommended)
  const { data: relatedData } = useGetRelatedServicesQuery(
    { id: service?.id },
    { skip: !service?.id }
  );
  const { data: recommendedData } = useGetRecommendedServicesQuery();

  // Check if user is owner (from service data)
  const isOwner = false;
  const isHiddenItem = service?.current_status !== 'PUBLISHED';

  // Map review stats from service data
  const reviewStats = useMemo(() => ({
    avg_rating: parseFloat(service?.avg_rating) || 0,
    total_reviews: service?.total_reviews || 0,
    rating_sequence: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  }), [service]);

  // Build packages from API data
  const packages = useMemo(() => {
    if (!service?.package_details) return [];
    const pkgs: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      oldPrice?: number;
      deliveryDays: number;
      revisions: number | 'Unlimited';
      features: string[];
    }> = [];

    if (service.package_details.basic?.price > 0) {
      pkgs.push({
        id: 'basic',
        name: service.package_details.basic.title || 'Basic',
        description: service.package_details.basic.short_description || 'Basic package',
        price: service.package_details.basic.price,
        oldPrice: service.package_details.basic.mrp !== service.package_details.basic.price
          ? service.package_details.basic.mrp : undefined,
        deliveryDays: service.package_details.basic.delivery_time || 3,
        revisions: 2,
        features: (service.package_details.basic.short_description || '').split('\n').filter(Boolean),
      });
    }

    if (service.package_details.standard?.price > 0) {
      pkgs.push({
        id: 'standard',
        name: service.package_details.standard.title || 'Standard',
        description: service.package_details.standard.short_description || 'Standard package',
        price: service.package_details.standard.price,
        oldPrice: service.package_details.standard.mrp !== service.package_details.standard.price
          ? service.package_details.standard.mrp : undefined,
        deliveryDays: service.package_details.standard.delivery_time || 7,
        revisions: 5,
        features: (service.package_details.standard.short_description || '').split('\n').filter(Boolean),
      });
    }

    if (service.package_details.premium?.price > 0) {
      pkgs.push({
        id: 'premium',
        name: service.package_details.premium.title || 'Premium',
        description: service.package_details.premium.short_description || 'Premium package',
        price: service.package_details.premium.price,
        oldPrice: service.package_details.premium.mrp !== service.package_details.premium.price
          ? service.package_details.premium.mrp : undefined,
        deliveryDays: service.package_details.premium.delivery_time || 14,
        revisions: 'Unlimited' as const,
        features: (service.package_details.premium.short_description || '').split('\n').filter(Boolean),
      });
    }

    return pkgs;
  }, [service]);

  // Build package tabs for comparison table
  const packageTabs = useMemo<PackageTab[]>(() => {
    return packages.map((pkg: any) => ({
      id: pkg.id as 'basic' | 'standard' | 'premium',
      title: pkg.name,
    }));
  }, [packages]);

  // Build packages comparison info
  const packagesComparisonInfo = useMemo<PackagesComparisonInfo | null>(() => {
    if (packages.length === 0) return null;

    const mapPackage = (pkg: any) => ({
      title: pkg.name,
      price: pkg.price,
      short_description: pkg.description,
      delivery_time: pkg.deliveryDays,
      attributes: pkg.features?.map((f: string) => ({ key: f, value: true })) || [],
    });

    const result: PackagesComparisonInfo = {};
    packages.forEach((pkg: any) => {
      if (pkg.id === 'basic') result.basic = mapPackage(pkg);
      if (pkg.id === 'standard') result.standard = mapPackage(pkg);
      if (pkg.id === 'premium') result.premium = mapPackage(pkg);
    });

    return result;
  }, [packages]);

  // Map related services from API (use related first, fallback to recommended)
  const relatedServices = useMemo<RelatedService[]>(() => {
    const items = relatedData?.items || recommendedData?.items || [];
    if (!items.length) return [];

    return items
      .filter((item: any) => item.slug !== slug)
      .slice(0, 4)
      .map((item: any) => ({
        id: item.id || item._id,
        slug: item.slug,
        title: item.service_title || item.title,
        img: prefixS3Url(item.thumbnail_image || item.image),
        authorName: item.user ? `${item.user.first_name} ${item.user.last_name}`.trim() : '',
        price: item.package_details?.basic?.price || item.price || 0,
        rating: parseFloat(item.avg_rating) || 0,
        reviews: item.total_reviews || 0,
      }));
  }, [relatedData, recommendedData, slug]);

  // Loading state
  if (serviceLoading) {
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
  if (serviceError || !service) {
    return (
      <section className="pt-4">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Service not found
            </h2>
            <p className="text-gray-500 mb-4">
              The service you&apos;re looking for could not be loaded.
            </p>
            <button
              onClick={() => refetchService()}
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

  // Map service data to component props
  const seller = {
    id: service.user?.sub || '',
    first_name: service.user?.first_name || '',
    last_name: service.user?.last_name || '',
    user_name: service.user?.user_name || '',
    profile_image: prefixS3Url(service.user?.profile_image),
    member_since: '',
    country: '',
    languages: ['English'],
    response_time: '1 hour',
    last_delivery: '',
    description: '',
    level: 'Level 2 Seller',
    total_reviews: service.total_reviews || 0,
    avg_rating: parseFloat(service.avg_rating) || 0,
    completed_orders: service.total_sales || 0,
    badges: [],
  };

  const galleryImages = service.thumbnail_image ? [prefixS3Url(service.thumbnail_image)] : [];
  const faqs = service.faqs || [];
  const tags = service.tags || [];
  const title = service.service_title || service.title || '';
  const shortDescription = service.package_details?.basic?.short_description || '';
  const fullDescription = `
    <h3>About This Service</h3>
    <p>${shortDescription || 'Professional service offered by experienced provider.'}</p>
  `;

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
                title={title}
                category={service.primary_category?.name || ''}
                categoryId={service.primary_category?.slug || ''}
                subcategory={service.secondary_category?.name}
                sellerName={`${seller.first_name} ${seller.last_name}`.trim()}
                sellerUsername={seller.user_name}
                avgRating={reviewStats.avg_rating}
                totalReviews={reviewStats.total_reviews}
                totalOrders={service.total_sales || 0}
                totalViews={0}
                responseTime="1 hour"
              />

              {/* Service Gallery */}
              <ServiceGallery
                images={galleryImages}
                videoUrl={undefined}
                title={title}
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
                      shortDescription={shortDescription}
                      fullDescription={fullDescription}
                    />

                    {/* Package Comparison Table */}
                    {packagesComparisonInfo && (
                      <PackageComparisonTable
                        tabs={packageTabs}
                        packagesInfo={packagesComparisonInfo}
                      />
                    )}

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="service-tags mb-6">
                        <h4 className="text-base font-semibold mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag: string, index: number) => (
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
                    reviews={[]}
                    avgRating={reviewStats.avg_rating}
                    totalReviews={reviewStats.total_reviews}
                    ratingSequence={reviewStats.rating_sequence}
                    currentPage={reviewPage}
                    totalPages={1}
                    onPageChange={setReviewPage}
                    onFilterChange={setReviewFilter}
                  />
                )}

                {activeTab === 'faq' && <ServiceFAQ faqs={faqs} />}
              </div>
            </div>

            {/* Sidebar - Right Column */}
            <div className="product-details-sidebar">
              {/* Social Share */}
              <ServiceSocialShare
                shareTitle="Share This Service"
                shareDescription="Share this service with your network!"
                totalLikes={0}
                isLiked={service.is_liked || false}
                serviceId={service.id}
                onLikeClick={handleLikeClick}
              />

              {/* Packages */}
              <ServicePackages
                packages={packages}
                onOrderNow={handleOrderNow}
                onAddToCart={handleAddToCart}
              />

              {/* Seller Card */}
              <SellerCard seller={seller} onContactClick={handleContactSeller} />
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
