"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  Tabs,
  Tag,
  Empty,
  Skeleton,
  Button,
  Pagination,
} from "antd";
import {
  EyeOff,
  Pencil,
  AlertCircle,
  Package,
  Briefcase,
} from "lucide-react";
import { useGetMyProductsQuery } from "@/state/services/seller-service/product.service";
import { useGetServicesQuery } from "@/state/services/seller-service/service.service";

// Mock data for development
const mockProducts = {
  products: [
    {
      id: "1",
      product_name: "React Dashboard Template",
      thumbnail_images: null,
      price: 79,
      current_status: "SOFT_REJECTED",
      updated_at: "2024-12-10T10:30:00Z",
      rejection_reason: "Missing documentation",
    },
    {
      id: "2",
      product_name: "E-commerce Starter Kit",
      thumbnail_images: null,
      price: 149,
      current_status: "SOFT_REJECTED",
      updated_at: "2024-12-08T14:20:00Z",
      rejection_reason: "Low quality preview images",
    },
  ],
  total_count: 2,
  per_page: 10,
};

const mockServices = {
  items: [
    {
      id: "1",
      service_title: "Logo Design Service",
      thumbnail_image: null,
      basic_price: 50,
      status: "SOFT_REJECTED",
      rejection_reason: "Incomplete service description",
    },
  ],
  meta: {
    total: 1,
  },
};

interface ProductItem {
  id: string;
  product_name: string;
  thumbnail_images?: string | null;
  product_preview_file?: string;
  price: number;
  current_status: string;
  updated_at: string;
  rejection_reason?: string;
}

interface ServiceItem {
  id: string;
  service_title: string;
  thumbnail_image?: string | null;
  basic_price: number;
  status: string;
  rejection_reason?: string;
}

export default function SellerHiddenItemsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");
  const [productPage, setProductPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);

  // Fetch products with SOFT_REJECTED status
  const {
    data: productsData,
    isLoading: productsLoading,
  } = useGetMyProductsQuery({
    page: productPage,
    status: "SOFT_REJECTED",
    sortLabel: "date_desc",
  });

  // Fetch services with SOFT_REJECTED status
  const {
    data: servicesData,
    isLoading: servicesLoading,
  } = useGetServicesQuery({
    page: servicePage,
    limit: "10",
    status: "SOFT_REJECTED",
    sortLabel: "date_desc",
  });

  // Use mock data if API returns no data
  const products = productsData || mockProducts;
  const services = servicesData || mockServices;

  const productItems: ProductItem[] = products?.products || [];
  const serviceItems: ServiceItem[] = services?.items || [];

  const productTotal = products?.total_count || 0;
  const serviceTotal = services?.meta?.total || 0;

  const handleEditProduct = (id: string) => {
    router.push(`/seller/product-edit/${id}`);
  };

  const handleEditService = (id: string) => {
    router.push(`/seller/service-edit/${id}`);
  };

  // Product Card Component
  const ProductCard = ({ item }: { item: ProductItem }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-36 sm:h-auto relative flex-shrink-0 bg-gray-100">
          <Image
            src={
              item.thumbnail_images
                ? `${process.env.NEXT_PUBLIC_S3BUCKET}/${item.thumbnail_images}`
                : "/images/listings/product-draft-default.png"
            }
            alt={item.product_name}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute top-2 left-2">
            <Tag color="orange">Hidden</Tag>
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                {item.product_name}
              </h3>
              <p className="text-lg font-bold text-gray-900 mb-2">
                ${item.price}
              </p>
              {item.rejection_reason && (
                <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{item.rejection_reason}</span>
                </div>
              )}
            </div>
            <Button
              type="primary"
              icon={<Pencil size={16} />}
              onClick={() => handleEditProduct(item.id)}
            >
              Edit & Resubmit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Service Card Component
  const ServiceCard = ({ item }: { item: ServiceItem }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-36 sm:h-auto relative flex-shrink-0 bg-gray-100">
          <Image
            src={
              item.thumbnail_image
                ? `${process.env.NEXT_PUBLIC_S3BUCKET}/${item.thumbnail_image}`
                : "/images/listings/product-draft-default.png"
            }
            alt={item.service_title}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute top-2 left-2">
            <Tag color="orange">Hidden</Tag>
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                {item.service_title}
              </h3>
              <p className="text-lg font-bold text-gray-900 mb-2">
                From ${item.basic_price}
              </p>
              {item.rejection_reason && (
                <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{item.rejection_reason}</span>
                </div>
              )}
            </div>
            <Button
              type="primary"
              icon={<Pencil size={16} />}
              onClick={() => handleEditService(item.id)}
            >
              Edit & Resubmit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Empty State Component
  const EmptyState = ({ type }: { type: "product" | "service" }) => (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {type === "product" ? (
          <Package size={40} className="text-gray-400" />
        ) : (
          <Briefcase size={40} className="text-gray-400" />
        )}
      </div>
      <h3 className="font-semibold text-lg text-gray-900 mb-2">
        No Hidden {type === "product" ? "Products" : "Services"}
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Great news! You don't have any hidden {type === "product" ? "products" : "services"}.
        All your items are either published or in draft.
      </p>
    </div>
  );

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex gap-4">
            <Skeleton.Image active style={{ width: 192, height: 128 }} />
            <div className="flex-1">
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const tabItems = [
    {
      key: "products",
      label: (
        <span className="flex items-center gap-2">
          <Package size={16} />
          Products ({productTotal})
        </span>
      ),
      children: (
        <div>
          {productsLoading ? (
            <LoadingSkeleton />
          ) : productItems.length > 0 ? (
            <>
              <div className="space-y-4">
                {productItems.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
              {productTotal > 10 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    current={productPage}
                    total={productTotal}
                    pageSize={10}
                    onChange={setProductPage}
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
      label: (
        <span className="flex items-center gap-2">
          <Briefcase size={16} />
          Services ({serviceTotal})
        </span>
      ),
      children: (
        <div>
          {servicesLoading ? (
            <LoadingSkeleton />
          ) : serviceItems.length > 0 ? (
            <>
              <div className="space-y-4">
                {serviceItems.map((item) => (
                  <ServiceCard key={item.id} item={item} />
                ))}
              </div>
              {serviceTotal > 10 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    current={servicePage}
                    total={serviceTotal}
                    pageSize={10}
                    onChange={setServicePage}
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
    <section className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Info Sidebar */}
          <div className="lg:col-span-1 order-last lg:order-first">
            <Card className="sticky top-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <EyeOff size={32} className="text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  What are Hidden Items?
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                When you submit a product or service, our team reviews it for
                quality. If we find minor issues, we place the item in hidden
                status.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  <strong>Action Required:</strong> Please update your items and
                  resubmit them for review.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href="/help/hidden-items"
                  className="text-sm text-primary hover:underline"
                >
                  Learn more about the review process
                </Link>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <EyeOff size={24} className="text-gray-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Hidden Items
                </h1>
                <p className="text-gray-500 text-sm">
                  {productTotal + serviceTotal} items need your attention
                </p>
              </div>
            </div>

            {/* Tabs */}
            <Card>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
              />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
