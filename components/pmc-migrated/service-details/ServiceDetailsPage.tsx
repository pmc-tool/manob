// Service Details Page - Main component (matching original PMC design)
'use client';

import { useState } from 'react';
import { FileText, MessageSquare, Star, Info } from 'lucide-react';
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
  mockService,
  mockServiceReviews,
  mockRelatedServices,
  mockServiceReviewStats,
  mockPackageTabs,
  mockPackagesComparisonInfo,
  PackageTab,
  PackagesComparisonInfo,
} from '@/lib/mocks/service-details.mock';
import PackageComparisonTable from './PackageComparisonTable';

interface ServiceDetailsPageProps {
  service?: ServiceData;
  reviews?: ServiceReview[];
  relatedServices?: typeof mockRelatedServices;
  reviewStats?: typeof mockServiceReviewStats;
  packageTabs?: PackageTab[];
  packagesComparisonInfo?: PackagesComparisonInfo;
}

export default function ServiceDetailsPage({
  service = mockService,
  reviews = mockServiceReviews,
  relatedServices = mockRelatedServices,
  reviewStats = mockServiceReviewStats,
  packageTabs = mockPackageTabs,
  packagesComparisonInfo = mockPackagesComparisonInfo,
}: ServiceDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'faq'>('description');
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewFilter, setReviewFilter] = useState('newest');

  // Check if user is owner (mock for now)
  const isOwner = false;
  const isHiddenItem = service.current_status !== 'PUBLISHED';

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
                    <PackageComparisonTable
                      tabs={packageTabs}
                      packagesInfo={packagesComparisonInfo}
                    />

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
