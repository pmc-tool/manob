// Product Details Page - Main component (matching original PMC design)
'use client';

import { useState } from 'react';
import { FileText, MessageSquare, Star, Info } from 'lucide-react';
import ItemHeader from './ItemHeader';
import ProductPreview from './ProductPreview';
import ItemDescription from './ItemDescription';
import ItemSocialShare from './ItemSocialShare';
import PriceBox from './PriceBox';
import CommunityBadgesCard from './CommunityBadgesCard';
import ItemAttributes from './ItemAttributes';
import Reviews from './Reviews';
import Comments from './Comments';
import CommentForm from './CommentForm';
import RelatedProductsCarousel from './RelatedProductsCarousel';
import useAddToCart from '@/hooks/useAddToCart';
import {
  ProductData,
  License,
  Review,
  Comment,
  mockProduct,
  mockLicenses,
  mockReviews,
  mockComments,
  mockRelatedProducts,
  mockReviewStats,
} from '@/lib/mocks/product-details.mock';

interface ProductDetailsPageProps {
  product?: ProductData;
  licenses?: License[];
  reviews?: Review[];
  comments?: Comment[];
  relatedProducts?: typeof mockRelatedProducts;
  reviewStats?: typeof mockReviewStats;
}

export default function ProductDetailsPage({
  product = mockProduct,
  licenses = mockLicenses,
  reviews = mockReviews,
  comments = mockComments,
  relatedProducts = mockRelatedProducts,
  reviewStats = mockReviewStats,
}: ProductDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'reviews'>('details');
  const [reviewPage, setReviewPage] = useState(1);
  const [commentPage, setCommentPage] = useState(1);
  const [reviewFilter, setReviewFilter] = useState('newest');
  const [commentFilter, setCommentFilter] = useState('newest');

  // Check if user is owner (mock for now)
  const isOwner = false;
  const isHiddenItem = product.current_status !== 'PUBLISHED';
  const hasPurchased = false;

  // Cart functionality
  const { addToCart, isLoading: cartLoading } = useAddToCart();

  const handleAddToCart = async (data: { isExtend: boolean; lic_type: string }) => {
    await addToCart(product.id, {
      quantity: 1,
      is_extended: data.isExtend,
      lic_type: data.lic_type as 'REGULAR' | 'EXTENDED',
    });
  };

  const handleLikeClick = (isLiked: boolean) => {
    console.log('Like clicked, current status:', isLiked);
  };

  const handleReviewReply = (reviewId: string, content: string) => {
    console.log('Reply to review:', reviewId, content);
  };

  const handleCommentReply = (commentId: string, content: string) => {
    console.log('Reply to comment:', commentId, content);
  };

  const handleCommentSubmit = (comment: string) => {
    console.log('New comment:', comment);
  };

  return (
    <>
      <section className="pt-4">
        <div className="container mx-auto px-4">
          {/* Original: row g-4 */}
          <div className="product-details-layout">
            {/* Main Content - Left Column: col-lg-8 pe-xxl-5 */}
            <div className="product-details-main">
              {/* Owner notification */}
              {isOwner && (
                <div className="alert alert-warning flex items-start gap-3">
                  <Info className="h-6 w-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="fz18 font-semibold mb-1">This product is yours! 🚀</h5>
                    <p className="fz14">
                      📌 You have created this product! ✅ Please review and take necessary action.
                    </p>
                  </div>
                </div>
              )}

              {/* Hidden item notification */}
              {isHiddenItem && (
                <div className="alert alert-primary flex items-start gap-3">
                  <Info className="h-6 w-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="fz18 font-semibold mb-1">This item is currently hidden! 🔒</h5>
                    <p className="fz14">
                      Before you can put this item on sale, it currently needs to be reviewed as
                      it&apos;s hidden. Simply use the &quot;Submit files to review&quot; button on
                      the Edit Tab. If your item was rejected, ensure all outlined issues are fixed.
                    </p>
                  </div>
                </div>
              )}

              {/* Item Header */}
              <ItemHeader
                title={product.product_name}
                authorName={`${product.user_meta.first_name} ${product.user_meta.last_name}`}
                authorId={product.user_meta.user_name}
                salesNumber={product.total_sales}
                viewsNumber={product.total_views}
              />

              {/* Product Preview */}
              <ProductPreview
                previewImage={product.product_preview_file_url}
                previewLink={`/product-preview/${product.id}`}
                previewAlt={product.product_name}
                screenshots={product.screenshots_urls}
                isOnSale={product.is_onsale}
              />

              {/* Tabs Navigation */}
              <ul className="item-details-tabs mb-8">
                <li className="nav-item">
                  <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                  >
                    <FileText className="h-4 w-4" />
                    Item Details
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    onClick={() => setActiveTab('comments')}
                    className={`nav-link ${activeTab === 'comments' ? 'active' : ''}`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Comments
                    <span className="badge">{comments.length}</span>
                  </button>
                </li>
                {(hasPurchased || reviews.length > 0) && (
                  <li className="nav-item">
                    <button
                      type="button"
                      onClick={() => setActiveTab('reviews')}
                      className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                    >
                      <Star className="h-4 w-4" />
                      {reviewStats.avg_rating.toFixed(1)} ({reviewStats.total_reviews})
                    </button>
                  </li>
                )}
              </ul>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'details' && (
                  <ItemDescription
                    shortDescription={product.short_description}
                    fullDescription={product.full_description}
                  />
                )}

                {activeTab === 'comments' && (
                  <>
                    <Comments
                      comments={comments}
                      totalComments={comments.length}
                      currentPage={commentPage}
                      totalPages={1}
                      onPageChange={setCommentPage}
                      onFilterChange={setCommentFilter}
                      onReply={handleCommentReply}
                      isOwner={isOwner}
                    />
                    <CommentForm productId={product.id} onSubmit={handleCommentSubmit} />
                  </>
                )}

                {activeTab === 'reviews' && (
                  <Reviews
                    reviews={reviews}
                    avgRating={reviewStats.avg_rating}
                    totalReviews={reviewStats.total_reviews}
                    ratingSequence={reviewStats.rating_sequence}
                    currentPage={reviewPage}
                    totalPages={1}
                    onPageChange={setReviewPage}
                    onFilterChange={setReviewFilter}
                    isOwner={isOwner}
                    onReply={handleReviewReply}
                  />
                )}
              </div>
            </div>

            {/* Sidebar - Right Column: col-lg-4 ps-xxl-5 */}
            <div className="product-details-sidebar">
              <ItemSocialShare
                shareTitle="Share This Item"
                shareDescription="Share This Item with your network and let others discover it! Spread the word and connect with more buyers. 🚀"
                totalLikes={product.total_likes}
                isLiked={product.is_liked}
                productId={product.id}
                onLikeClick={handleLikeClick}
              />

              <PriceBox
                licenses={licenses}
                productName={product.product_name}
                supportProvider={`${product.user_meta.first_name} ${product.user_meta.last_name}`}
                isOwner={hasPurchased}
                userName={product.user_meta.user_name}
                currentStatus={product.current_status}
                onAddToCart={handleAddToCart}
                sellerProfile={`/${product.user_meta.user_name}`}
              />

              <CommunityBadgesCard
                logoSrc={product.user_meta.profile_image}
                memberName={`${product.user_meta.first_name} ${product.user_meta.last_name}`}
                memberSince={product.user_meta.member_since}
                profileLink={product.user_meta.user_name}
                userMeta={isOwner ? null : product.user_meta}
              />

              <ItemAttributes
                updatedAt={product.updated_at}
                createdAt={product.created_at}
                productAttributes={product.product_attributes}
                isGutenberg={product.is_gutenberg_potimized}
                highResolution={product.is_high_resolution}
                columns={product.layout_columns}
                layout={product.layout_type}
                tags={product.product_tags}
                documentation={!!product.product_doc_url}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <RelatedProductsCarousel
          title="People who viewed this product also viewed similar products."
          linkHref="/product-list"
          linkText="More Products"
          products={relatedProducts}
        />
      )}
    </>
  );
}
