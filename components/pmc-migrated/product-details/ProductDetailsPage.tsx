// Product Details Page - Main component (matching original PMC design)
'use client';

import { useState, useEffect, useMemo } from 'react';
import { FileText, MessageSquare, Star, Info, Loader2 } from 'lucide-react';
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
  useGetProductsQuery,
  useGetPublicProductQuery,
  useGetRelatedProductQuery,
} from '@/state/services/home-service/public-product.service';
import {
  ProductData,
  License,
  Review,
  Comment,
} from '@/lib/mocks/product-details.mock';

const S3_BUCKET = process.env.NEXT_PUBLIC_S3BUCKET || '';

// Helper to construct proper image URLs
const getImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return '';
  // If already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${S3_BUCKET}/${cleanPath}`;
};

interface ProductDetailsPageProps {
  slug: string;
}

export default function ProductDetailsPage({ slug }: ProductDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'reviews'>('details');
  const [reviewPage, setReviewPage] = useState(1);
  const [commentPage, setCommentPage] = useState(1);
  const [reviewFilter, setReviewFilter] = useState('newest');
  const [commentFilter, setCommentFilter] = useState('newest');

  // Fetch products from API using RTK Query
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isProductsError,
    refetch: refetchProducts
  } = useGetProductsQuery({
    queryParams: {
      page: 1,
      limit: 50,
      slug: slug
    }
  });

  // Find product by slug from the items
  const feedProduct = useMemo(() => {
    const items = productsData?.items || [];
    return items.find((item: any) => item.slug === slug) || items[0];
  }, [productsData, slug]);

  // Fetch detailed product info if we have an ID
  const { data: detailedProduct } = useGetPublicProductQuery(
    { id: feedProduct?.id },
    { skip: !feedProduct?.id }
  );

  // Fetch related products
  const { data: relatedData } = useGetRelatedProductQuery(
    { id: feedProduct?.id },
    { skip: !feedProduct?.id }
  );

  // Map the data to ProductData format
  const product: ProductData | null = useMemo(() => {
    if (!feedProduct) return null;

    return {
      id: feedProduct.id,
      product_name: feedProduct.product_name,
      short_description: feedProduct.short_description || detailedProduct?.short_description || '',
      full_description: detailedProduct?.full_description || '',
      product_preview_file_url: getImageUrl(feedProduct.image),
      screenshots_urls: detailedProduct?.thumbnail_images?.map((img: string) => getImageUrl(img)) || [],
      is_onsale: feedProduct.is_onsale,
      regular_lic_price: feedProduct.price || detailedProduct?.price || 0,
      regular_lic_fee: 0,
      extended_lic_price: detailedProduct?.extended_price || (feedProduct.price || 0) * 5,
      extended_lic_fee: 0,
      discount_regular_price: feedProduct.mrp < feedProduct.price ? feedProduct.mrp : 0,
      discount_extended_price: 0,
      total_sales: feedProduct.total_sales || 0,
      total_views: 0,
      total_likes: 0,
      is_liked: feedProduct.is_liked,
      current_status: detailedProduct?.current_status || 'PUBLISHED',
      product_attributes: [],
      is_gutenberg_potimized: false,
      is_high_resolution: true,
      layout_columns: '4+',
      layout_type: 'Responsive',
      product_tags: [],
      product_doc_url: detailedProduct?.product_doc_url || '',
      updated_at: feedProduct.updated_at,
      created_at: detailedProduct?.created_at || feedProduct.updated_at,
      user_meta: {
        sub: feedProduct.user?.sub || '',
        first_name: feedProduct.user?.first_name || '',
        last_name: feedProduct.user?.last_name || '',
        user_name: feedProduct.user?.user_name || '',
        profile_image: getImageUrl(feedProduct.user?.profile_image),
        member_since: '',
      },
    };
  }, [feedProduct, detailedProduct]);

  // Map licenses
  const licenses: License[] = useMemo(() => {
    if (!feedProduct) return [];
    return [
      {
        type: 'Regular License',
        lic_type: 'REGULAR',
        price: feedProduct.price || detailedProduct?.price || 0,
        oldPrice: feedProduct.is_onsale && feedProduct.mrp > feedProduct.price ? feedProduct.mrp : 0,
        extendSupportPrice: (feedProduct.price || 0) * 0.3,
        extendSupportOldPrice: 0,
        description: 'Use, by you or one client, in a single end product which end users are not charged for.',
      },
      {
        type: 'Extended License',
        lic_type: 'EXTENDED',
        price: detailedProduct?.extended_price || (feedProduct.price || 0) * 5,
        oldPrice: 0,
        extendSupportPrice: (detailedProduct?.extended_price || (feedProduct.price || 0) * 5) * 0.3,
        extendSupportOldPrice: 0,
        description: 'Use, by you or one client, in a single end product which end users can be charged for.',
      },
    ];
  }, [feedProduct, detailedProduct]);

  // Map related products
  const relatedProducts = useMemo(() => {
    const items = relatedData?.items || productsData?.items || [];
    return items
      .filter((item: any) => item.id !== feedProduct?.id)
      .slice(0, 4)
      .map((item: any) => ({
        id: item.id,
        title: item.product_name,
        thumbnail_image: getImageUrl(item.image),
        price: item.price,
        total_sales: item.total_sales || 0,
        avg_rating: parseFloat(item.avg_rating) || 0,
        total_reviews: item.total_reviews || 0,
        creator: {
          first_name: item.user?.first_name || '',
          last_name: item.user?.last_name || '',
          user_name: item.user?.user_name || '',
        },
      }));
  }, [relatedData, productsData, feedProduct]);

  // Reviews and comments (empty for now, can be fetched separately)
  const reviews: Review[] = [];
  const comments: Comment[] = [];
  const reviewStats = {
    avg_rating: parseFloat(feedProduct?.avg_rating) || 0,
    total_reviews: feedProduct?.total_reviews || 0,
    rating_sequence: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  };

  // Check if user is owner (mock for now)
  const isOwner = false;
  const isHiddenItem = product?.current_status !== 'PUBLISHED';
  const hasPurchased = false;

  // Cart functionality
  const { addToCart, isLoading: cartLoading } = useAddToCart();

  const handleAddToCart = async (data: { isExtend: boolean; lic_type: string }) => {
    if (!product) return;
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

  // Loading state
  if (isLoadingProducts) {
    return (
      <section className="pt-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-3 text-gray-500">Loading product details...</span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (isProductsError || !product) {
    return (
      <section className="pt-4">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Product not found
            </h2>
            <p className="text-gray-500 mb-4">
              The product you&apos;re looking for could not be loaded.
            </p>
            <button
              onClick={() => refetchProducts()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

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
                    <h5 className="text-lg font-semibold mb-1">This product is yours! 🚀</h5>
                    <p className="text-sm">
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
                    <h5 className="text-lg font-semibold mb-1">This item is currently hidden! 🔒</h5>
                    <p className="text-sm">
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
              <ul className="flex bg-[#222222] rounded-lg overflow-hidden list-none p-0 m-0 mb-8">
                <li className="flex-1 border-r border-[#393939] last:border-r-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className={`inline-flex items-center justify-center gap-2 py-3.5 px-4 w-full bg-transparent border-none font-medium text-sm cursor-pointer transition-all whitespace-nowrap leading-normal ${activeTab === 'details' ? 'bg-primary text-white' : 'text-[#a9a9a9] hover:text-white hover:bg-primary'}`}
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    Item Details
                  </button>
                </li>
                <li className="flex-1 border-r border-[#393939] last:border-r-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('comments')}
                    className={`inline-flex items-center justify-center gap-2 py-3.5 px-4 w-full bg-transparent border-none font-medium text-sm cursor-pointer transition-all whitespace-nowrap leading-normal ${activeTab === 'comments' ? 'bg-primary text-white' : 'text-[#a9a9a9] hover:text-white hover:bg-primary'}`}
                  >
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    Comments
                    <span className={`px-2 py-0.5 rounded-xl text-xs leading-none ${activeTab === 'comments' ? 'bg-white text-primary' : 'bg-white/20 text-white'}`}>{comments.length}</span>
                  </button>
                </li>
                {(hasPurchased || reviews.length > 0) && (
                  <li className="flex-1 border-r border-[#393939] last:border-r-0">
                    <button
                      type="button"
                      onClick={() => setActiveTab('reviews')}
                      className={`inline-flex items-center justify-center gap-2 py-3.5 px-4 w-full bg-transparent border-none font-medium text-sm cursor-pointer transition-all whitespace-nowrap leading-normal ${activeTab === 'reviews' ? 'bg-primary text-white' : 'text-[#a9a9a9] hover:text-white hover:bg-primary'}`}
                    >
                      <Star className="h-4 w-4 shrink-0" />
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
