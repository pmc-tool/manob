"use client";
import { Tabs, Empty, Pagination, Skeleton } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star } from "lucide-react";
import {
  useGetFavoriteProductsQuery,
  useGetFavoriteServicesQuery,
} from "@/state/services/favorites/favorite.service";

export default function UserFavoritesList() {
  const [activeTab, setActiveTab] = useState("products");
  const [productQuery, setProductQuery] = useState({ page: 1, limit: 10 });
  const [serviceQuery, setServiceQuery] = useState({ page: 1, limit: 10 });

  const { data: favoriteProducts, isLoading: loadingProducts } =
    useGetFavoriteProductsQuery(productQuery);
  const { data: favoriteServices, isLoading: loadingServices } =
    useGetFavoriteServicesQuery(serviceQuery);

  const productTotalCount = favoriteProducts?.data?.pagination?.total_count || 0;
  const serviceTotalCount = favoriteServices?.data?.pagination?.total_count || 0;

  const handleProductPageChange = (page: number) => {
    setProductQuery({ ...productQuery, page });
  };

  const handleServicePageChange = (page: number) => {
    setServiceQuery({ ...serviceQuery, page });
  };

  const ProductCard = ({ item }: { item: any }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow mb-4">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-48 h-40 sm:h-auto relative flex-shrink-0">
          <Link href={`/product-details/${item.slug}`}>
            <Image
              src={item.thumbnail_image ? `${process.env.NEXT_PUBLIC_S3BUCKET}/${item.thumbnail_image}` : "/images/listings/product-draft-default.png"}
              alt={item.title}
              fill
              className="object-cover"
              unoptimized
            />
          </Link>
        </div>
        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 mb-1">{item.primary_category}</p>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                <Link href={`/product-details/${item.slug}`} className="hover:text-primary">
                  {item.title}
                </Link>
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400" fill="#facc15" />
                  <span className="font-medium">{item.avg_rating || 0}</span>
                  <span className="text-gray-400">({item.total_reviews || 0})</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">{item.total_sales || 0} sales</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">${item.price}</div>
              {item.price > item.mrp && item.mrp > 0 && (
                <div className="text-sm text-gray-400 line-through">${item.mrp}</div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <Image
              src={item.creator?.profile_image ? `${process.env.NEXT_PUBLIC_S3BUCKET}/${item.creator.profile_image}` : "/images/user-placeholder.jpg"}
              alt={item.creator?.name || "Author"}
              width={24}
              height={24}
              className="rounded-full"
              unoptimized
            />
            <span className="text-sm text-gray-600">by {item.creator?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ServiceCard = ({ item }: { item: any }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow mb-4">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-48 h-40 sm:h-auto relative flex-shrink-0">
          <Link href={`/service-details/${item.slug}`}>
            <Image
              src={item.thumbnail_image ? `${process.env.NEXT_PUBLIC_S3BUCKET}/${item.thumbnail_image}` : "/images/listings/product-draft-default.png"}
              alt={item.title}
              fill
              className="object-cover"
              unoptimized
            />
          </Link>
        </div>
        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                <Link href={`/service-details/${item.slug}`} className="hover:text-primary">
                  {item.title}
                </Link>
              </h3>
              <div className="flex items-center gap-4 text-sm mb-3">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400" fill="#facc15" />
                  <span className="font-medium">{Number(item.avg_rating) || 0}</span>
                  <span className="text-gray-400">({item.total_reviews || 0})</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src={item.creator?.profile_image ? `${process.env.NEXT_PUBLIC_S3BUCKET}/${item.creator.profile_image}` : "/images/user-placeholder.jpg"}
                  alt={item.creator?.name || "Author"}
                  width={24}
                  height={24}
                  className="rounded-full"
                  unoptimized
                />
                <Link href={`/${item.creator?.user_name}`} className="text-sm text-gray-600 hover:text-primary">
                  {item.creator?.name}
                </Link>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Starting at</div>
              <div className="text-xl font-bold text-gray-900">${item.price}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const EmptyState = ({ type }: { type: string }) => (
    <div className="text-center py-12">
      <Image
        src={type === "product" ? "/images/empty-icon/favorite-products.svg" : "/images/empty-icon/service-02.svg"}
        alt="Not Found"
        width={120}
        height={120}
        className="mx-auto"
      />
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Your Favorites List is Empty</h3>
        <p className="text-gray-500 mt-1">
          You haven't added any favorites yet. Start exploring and
          <br className="hidden sm:block" /> mark your top picks to see them here!
        </p>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex gap-4">
            <Skeleton.Image active style={{ width: 192, height: 128 }} />
            <div className="flex-1">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const tabItems = [
    {
      key: "products",
      label: `Products (${productTotalCount})`,
      children: (
        <div>
          {loadingProducts ? (
            <LoadingSkeleton />
          ) : favoriteProducts?.data?.items?.length > 0 ? (
            <>
              {favoriteProducts.data.items.map((item: any) => (
                <ProductCard key={item.id} item={item} />
              ))}
              {favoriteProducts.data.pagination?.total_pages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    current={favoriteProducts.data.pagination.current_page}
                    total={favoriteProducts.data.pagination.total_count}
                    pageSize={10}
                    onChange={handleProductPageChange}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState type="product" />
          )}
        </div>
      ),
    },
    {
      key: "services",
      label: `Services (${serviceTotalCount})`,
      children: (
        <div>
          {loadingServices ? (
            <LoadingSkeleton />
          ) : favoriteServices?.data?.items?.length > 0 ? (
            <>
              {favoriteServices.data.items.map((item: any) => (
                <ServiceCard key={item.id} item={item} />
              ))}
              {favoriteServices.data.pagination?.total_pages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    current={favoriteServices.data.pagination.current_page}
                    total={favoriteServices.data.pagination.total_count}
                    pageSize={10}
                    onChange={handleServicePageChange}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState type="service" />
          )}
        </div>
      ),
    },
  ];

  return (
    <section className="pt-4 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-xl font-medium">
              Favorites {activeTab === "products" ? "Product" : "Service"}
            </h1>
            <p className="text-gray-500 text-sm">
              {activeTab === "products" ? productTotalCount : serviceTotalCount} items
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="favorites-tabs"
        />
      </div>
    </section>
  );
}
