// MIGRATION: Product detail from PMC
// VIPER: Visual consistency with Engine design system
// CONTRACT: Uses productsApi for data fetching

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button, InputNumber, Tag, Rate, Tabs, message, Breadcrumb } from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { productsApi } from '@/lib/api/products';
import { cartApi } from '@/lib/api/cart';
import type { Product, Review } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';
import { ErrorDisplay } from '@/components/pmc-migrated/shared/ErrorBoundary';

interface ProductDetailProps {
  productId: string;
  initialData?: Product;
}

/**
 * Product Detail Component
 * MIGRATION: Full product detail view with gallery and actions
 */
export function ProductDetail({ productId, initialData }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(initialData || null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<ReturnType<typeof handleError> | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productData, reviewsData] = await Promise.all([
          initialData ? Promise.resolve(initialData) : productsApi.getProduct(productId),
          productsApi.getProductReviews(productId, { limit: 5 }),
        ]);

        setProduct(productData);
        setReviews(reviewsData.reviews);
      } catch (err) {
        const displayError = handleError(err as Parameters<typeof handleError>[0]);
        setError(displayError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, initialData]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);
      await cartApi.addItem({ productId: product.id, quantity });
      message.success(`Added ${quantity} item(s) to cart`);
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading product..." />;
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={() => window.location.reload()}
        showRetry
      />
    );
  }

  if (!product) {
    return null;
  }

  const images = product.images.length > 0 ? product.images : [product.thumbnail].filter(Boolean);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { title: <Link href="/">Home</Link> },
          { title: <Link href="/products">Products</Link> },
          { title: product.category?.name || 'Category' },
          { title: product.title },
        ]}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
            {images[selectedImage] ? (
              <Image
                src={images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index
                      ? 'border-blue-600'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image src={img} alt={`${product.title} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title & Rating */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
              {product.title}
            </h1>
            <div className="mt-2 flex items-center gap-4">
              <Rate disabled defaultValue={product.rating} allowHalf />
              <span className="text-gray-500">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-gray-900">
            {product.currency} {product.price.toFixed(2)}
          </div>

          {/* Stock Status */}
          <div>
            {product.stock > 0 ? (
              <Tag color="green" icon={<CheckCircleOutlined />}>
                In Stock ({product.stock} available)
              </Tag>
            ) : (
              <Tag color="red">Out of Stock</Tag>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600">{product.description}</p>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}

          {/* Quantity & Add to Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Quantity:</span>
                <InputNumber
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={(val) => setQuantity(val || 1)}
                />
              </div>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                loading={addingToCart}
                className="flex-1"
              >
                Add to Cart
              </Button>
              <Button size="large" icon={<HeartOutlined />} title="Add to Wishlist" />
              <Button size="large" icon={<ShareAltOutlined />} title="Share" />
            </div>
          )}

          {/* Trust Badges */}
          <div className="flex gap-6 border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2 text-gray-600">
              <TruckOutlined className="text-xl" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <SafetyOutlined className="text-xl" />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Reviews, etc. */}
      <Tabs
        defaultActiveKey="description"
        items={[
          {
            key: 'description',
            label: 'Description',
            children: (
              <div className="prose max-w-none">
                <p>{product.description}</p>
              </div>
            ),
          },
          {
            key: 'reviews',
            label: `Reviews (${product.reviewCount})`,
            children: (
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-gray-500">No reviews yet</p>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user.name}</span>
                          <Rate disabled defaultValue={review.rating} className="text-sm" />
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.title && (
                        <h4 className="mt-2 font-medium">{review.title}</h4>
                      )}
                      <p className="mt-1 text-gray-600">{review.content}</p>
                    </div>
                  ))
                )}
              </div>
            ),
          },
        ]}
        className="rounded-2xl border border-gray-200 bg-white p-6"
      />
    </div>
  );
}

export default ProductDetail;
