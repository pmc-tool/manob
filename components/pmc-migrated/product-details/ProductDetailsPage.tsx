// Product Details Page - Main component (matching original PMC design)
'use client';

import { useState, useEffect, useCallback } from 'react';
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
  ProductData,
  License,
  Review,
  Comment,
  mockRelatedProducts,
} from '@/lib/mocks/product-details.mock';

const API_URL_FEED = process.env.NEXT_PUBLIC_API_URL_FEED || '';
const API_URL_INV = process.env.NEXT_PUBLIC_API_URL_INV || '';
const S3_BUCKET = process.env.NEXT_PUBLIC_S3BUCKET || '';

// API Response interfaces
interface ApiFeedProduct {
  id: string;
  product_name: string;
  slug: string;
  mrp: number;
  price: number;
  image: string;
  short_description: string;
  avg_rating: string;
  total_reviews: number;
  total_sales: number;
  is_onsale: boolean;
  is_liked: boolean;
  updated_at: string;
  primary_category?: { id: number; name: string; slug: string };
  secondary_category?: { id: number; name: string; slug: string };
  user?: {
    sub: string;
    first_name: string;
    last_name: string;
    user_name: string;
    email: string;
    profile_image: string;
  };
}

interface ApiInvProduct {
  id: string;
  product_name: string;
  short_description: string;
  full_description: string;
  product_demo_url: string;
  product_doc_url: string;
  price: number;
  extended_price: number;
  current_status: string;
  created_at?: string;
  author_id: string;
  product_preview_file?: string;
  thumbnail_images?: string[];
}

interface ApiReview {
  id: string;
  review_rating: string;
  review_content: string;
  reply_content?: string;
  created_at: string;
  reviewer_meta: {
    id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    avatar: string;
    member_since: string;
  };
}

interface ApiComment {
  id: string;
  content: string;
  created_at: string;
  user_meta: {
    id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    avatar: string;
  };
  replies?: Array<{
    id: string;
    content: string;
    created_at: string;
    is_author: boolean;
    user_meta: {
      first_name: string;
      last_name: string;
      user_name: string;
      avatar: string;
    };
  }>;
}

interface ApiReviewStats {
  total_reviews: number;
  avg_rating: number;
  rating_sequence: {
    one_star: string;
    two_star: string;
    three_star: string;
    four_star: string;
    five_star: string;
  };
}

interface ProductDetailsPageProps {
  slug: string;
}

export default function ProductDetailsPage({ slug }: ProductDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'reviews'>('details');
  const [reviewPage, setReviewPage] = useState(1);
  const [commentPage, setCommentPage] = useState(1);
  const [reviewFilter, setReviewFilter] = useState('newest');
  const [commentFilter, setCommentFilter] = useState('newest');

  // Data states
  const [product, setProduct] = useState<ProductData | null>(null);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reviewStats, setReviewStats] = useState({ avg_rating: 0, total_reviews: 0, rating_sequence: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [relatedProducts, setRelatedProducts] = useState<typeof mockRelatedProducts>([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is owner (mock for now)
  const isOwner = false;
  const isHiddenItem = product?.current_status !== 'PUBLISHED';
  const hasPurchased = false;

  // Fetch product data
  const fetchProductData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Search for product by slug in feed API to get UUID and basic info
      const feedResponse = await fetch(`${API_URL_FEED}/themes?search=${encodeURIComponent(slug.replace(/-/g, ' '))}&limit=50`);
      if (!feedResponse.ok) throw new Error('Failed to fetch product');

      const feedJson = await feedResponse.json();
      const feedItems: ApiFeedProduct[] = feedJson.data?.items || [];

      // Find exact match by slug
      const feedProduct = feedItems.find((item) => item.slug === slug);
      if (!feedProduct) throw new Error('Product not found');

      const productId = feedProduct.id;

      // Step 2: Fetch detailed product info from inventory API
      const invResponse = await fetch(`${API_URL_INV}/products/${productId}`);
      let invProduct: ApiInvProduct | null = null;
      if (invResponse.ok) {
        const invJson = await invResponse.json();
        invProduct = invJson.data;
      }

      // Step 3: Fetch reviews
      const reviewsResponse = await fetch(`${API_URL_INV}/products/${productId}/reviews`);
      let reviewsData: { stats: ApiReviewStats; items: ApiReview[] } = {
        stats: { total_reviews: 0, avg_rating: 0, rating_sequence: { one_star: '0', two_star: '0', three_star: '0', four_star: '0', five_star: '0' } },
        items: [],
      };
      if (reviewsResponse.ok) {
        const reviewsJson = await reviewsResponse.json();
        reviewsData = reviewsJson.data || reviewsData;
      }

      // Step 4: Fetch comments
      const commentsResponse = await fetch(`${API_URL_INV}/products/${productId}/comments?page=1&limit=20`);
      let commentsData: ApiComment[] = [];
      if (commentsResponse.ok) {
        const commentsJson = await commentsResponse.json();
        commentsData = commentsJson.data?.items || [];
      }

      // Step 5: Fetch related products (same category)
      const relatedResponse = await fetch(`${API_URL_FEED}/themes?limit=4`);
      let relatedItems: ApiFeedProduct[] = [];
      if (relatedResponse.ok) {
        const relatedJson = await relatedResponse.json();
        relatedItems = (relatedJson.data?.items || []).filter((item: ApiFeedProduct) => item.id !== productId).slice(0, 4);
      }

      // Map feed + inventory data to ProductData
      const mappedProduct: ProductData = {
        id: feedProduct.id,
        product_name: feedProduct.product_name,
        short_description: feedProduct.short_description || invProduct?.short_description || '',
        full_description: invProduct?.full_description || '',
        product_preview_file_url: feedProduct.image ? `${S3_BUCKET}/${feedProduct.image}` : '',
        screenshots_urls: invProduct?.thumbnail_images?.map((img) => `${S3_BUCKET}/${img}`) || [],
        is_onsale: feedProduct.is_onsale,
        regular_lic_price: feedProduct.price || invProduct?.price || 0,
        regular_lic_fee: 0,
        extended_lic_price: invProduct?.extended_price || feedProduct.price * 5 || 0,
        extended_lic_fee: 0,
        discount_regular_price: feedProduct.mrp < feedProduct.price ? feedProduct.mrp : 0,
        discount_extended_price: 0,
        total_sales: feedProduct.total_sales || 0,
        total_views: 0,
        total_likes: 0,
        is_liked: feedProduct.is_liked,
        current_status: invProduct?.current_status || 'PUBLISHED',
        product_attributes: [],
        is_gutenberg_potimized: false,
        is_high_resolution: true,
        layout_columns: '4+',
        layout_type: 'Responsive',
        product_tags: [],
        product_doc_url: invProduct?.product_doc_url || '',
        updated_at: feedProduct.updated_at,
        created_at: invProduct?.created_at || feedProduct.updated_at,
        user_meta: {
          sub: feedProduct.user?.sub || '',
          first_name: feedProduct.user?.first_name || '',
          last_name: feedProduct.user?.last_name || '',
          user_name: feedProduct.user?.user_name || '',
          profile_image: feedProduct.user?.profile_image ? `${S3_BUCKET}/${feedProduct.user.profile_image}` : '',
          member_since: '',
        },
      };

      // Map licenses
      const mappedLicenses: License[] = [
        {
          type: 'Regular License',
          lic_type: 'REGULAR',
          price: feedProduct.price || invProduct?.price || 0,
          oldPrice: feedProduct.is_onsale && feedProduct.mrp > feedProduct.price ? feedProduct.mrp : 0,
          extendSupportPrice: (feedProduct.price || 0) * 0.3,
          extendSupportOldPrice: 0,
          description: 'Use, by you or one client, in a single end product which end users are not charged for.',
        },
        {
          type: 'Extended License',
          lic_type: 'EXTENDED',
          price: invProduct?.extended_price || (feedProduct.price || 0) * 5,
          oldPrice: 0,
          extendSupportPrice: ((invProduct?.extended_price || 0) || (feedProduct.price || 0) * 5) * 0.3,
          extendSupportOldPrice: 0,
          description: 'Use, by you or one client, in a single end product which end users can be charged for.',
        },
      ];

      // Map reviews
      const mappedReviews: Review[] = reviewsData.items.map((r) => ({
        id: r.id,
        user_name: `${r.reviewer_meta.first_name} ${r.reviewer_meta.last_name}`,
        user_avatar: r.reviewer_meta.avatar ? `${S3_BUCKET}/${r.reviewer_meta.avatar}` : '',
        rating: parseFloat(r.review_rating) || 0,
        content: r.review_content,
        created_at: r.created_at,
        author_reply: r.reply_content || undefined,
      }));

      // Map review stats
      const mappedReviewStats = {
        avg_rating: reviewsData.stats.avg_rating || parseFloat(feedProduct.avg_rating) || 0,
        total_reviews: reviewsData.stats.total_reviews || feedProduct.total_reviews || 0,
        rating_sequence: {
          5: parseInt(reviewsData.stats.rating_sequence.five_star) || 0,
          4: parseInt(reviewsData.stats.rating_sequence.four_star) || 0,
          3: parseInt(reviewsData.stats.rating_sequence.three_star) || 0,
          2: parseInt(reviewsData.stats.rating_sequence.two_star) || 0,
          1: parseInt(reviewsData.stats.rating_sequence.one_star) || 0,
        },
      };

      // Map comments
      const mappedComments: Comment[] = commentsData.map((c) => ({
        id: c.id,
        user_name: `${c.user_meta?.first_name || ''} ${c.user_meta?.last_name || ''}`.trim() || 'Anonymous',
        user_avatar: c.user_meta?.avatar ? `${S3_BUCKET}/${c.user_meta.avatar}` : '',
        content: c.content,
        created_at: c.created_at,
        replies: c.replies?.map((r) => ({
          id: r.id,
          user_name: `${r.user_meta?.first_name || ''} ${r.user_meta?.last_name || ''}`.trim() || 'Anonymous',
          user_avatar: r.user_meta?.avatar ? `${S3_BUCKET}/${r.user_meta.avatar}` : '',
          content: r.content,
          created_at: r.created_at,
          is_author: r.is_author,
        })),
      }));

      // Map related products
      const mappedRelated = relatedItems.map((item) => ({
        id: item.id,
        title: item.product_name,
        thumbnail_image: item.image ? `${S3_BUCKET}/${item.image}` : '',
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

      // Set all states
      setProduct(mappedProduct);
      setLicenses(mappedLicenses);
      setReviews(mappedReviews);
      setReviewStats(mappedReviewStats);
      setComments(mappedComments);
      setRelatedProducts(mappedRelated);
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchProductData();
    }
  }, [slug, fetchProductData]);

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
  if (loading) {
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
  if (error || !product) {
    return (
      <section className="pt-4">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {error || 'Product not found'}
            </h2>
            <p className="text-gray-500 mb-4">
              The product you&apos;re looking for could not be loaded.
            </p>
            <button
              onClick={fetchProductData}
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
