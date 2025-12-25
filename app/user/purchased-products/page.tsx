"use client";
import { Button, Dropdown, Tag, Skeleton, Pagination, Input } from "antd";
import type { MenuProps } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Download,
  Eye,
  Star,
  FileCode,
  FileText,
  Search,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { useGetPurchaseProductsQuery } from "@/state/services/user-service/purchase-items.service";
import { dateFormat } from "@/utils/dateFormat";
import { useSelector } from "react-redux";

// Mock data for development
const mockPurchasedProducts = [
  {
    id: "prod-001",
    product_name: "Premium React Admin Dashboard",
    product_preview_file: null,
    slug: "premium-react-admin-dashboard",
    primary_category_name: "Admin Templates",
    author_name: "TechCraft Studio",
    creator_meta: { user_name: "techcraft", profile_image: null },
    avg_rating: 4.8,
    total_reviews: 124,
    lics: [
      {
        id: "lic-001",
        license_code: "PMC-2024-XXXX-XXXX",
        meta: { license_type: "Regular" },
        created_at: "2024-12-10T10:30:00Z",
      },
    ],
  },
  {
    id: "prod-002",
    product_name: "E-commerce Website Complete Package",
    product_preview_file: null,
    slug: "ecommerce-website-package",
    primary_category_name: "Website Templates",
    author_name: "WebDev Pro",
    creator_meta: { user_name: "webdevpro", profile_image: null },
    avg_rating: 4.9,
    total_reviews: 89,
    lics: [
      {
        id: "lic-002",
        license_code: "PMC-2024-YYYY-YYYY",
        meta: { license_type: "Extended" },
        created_at: "2024-12-05T14:20:00Z",
      },
    ],
  },
  {
    id: "prod-003",
    product_name: "Mobile App UI Kit - iOS & Android",
    product_preview_file: null,
    slug: "mobile-app-ui-kit",
    primary_category_name: "UI Kits",
    author_name: "DesignMaster",
    creator_meta: { user_name: "designmaster", profile_image: null },
    avg_rating: 4.7,
    total_reviews: 56,
    lics: [
      {
        id: "lic-003",
        license_code: "PMC-2024-ZZZZ-ZZZZ",
        meta: { license_type: "Regular" },
        created_at: "2024-11-28T09:15:00Z",
      },
    ],
  },
];

export default function PurchasedProducts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const token = useSelector((state: any) => state.auth?.accessToken);

  const {
    data: apiData,
    isLoading,
  } = useGetPurchaseProductsQuery({
    page: currentPage,
    limit: "10",
  });

  // Use mock data if API returns no data
  const purchasedItems =
    apiData && apiData.length > 0 ? apiData : mockPurchasedProducts;
  const totalCount =
    apiData?.pagination?.total_count || mockPurchasedProducts.length;

  // Filter items based on search
  const filteredItems = searchQuery
    ? purchasedItems.filter((item: any) =>
        item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : purchasedItems;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDownloadAll = async (itemId: string, filename: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_INV}/purchase-list/products/${itemId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(data);
      link.download = `${filename}_${new Date().getTime()}`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleDownloadCertificateText = (lics: any[]) => {
    let textContent = "";
    lics?.forEach((lic: any, index: number) => {
      textContent += `Purchase Code #${index + 1}: ${lic?.license_code}\n`;
    });
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "certificate.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getDropdownItems = (item: any): MenuProps["items"] => [
    {
      key: "files",
      label: "All Files & Documentation",
      icon: <FileCode size={14} />,
      onClick: () => handleDownloadAll(item?.lics?.[0]?.id, item?.slug),
    },
    {
      key: "code",
      label: "Purchase Code (Text)",
      icon: <FileText size={14} />,
      onClick: () => handleDownloadCertificateText(item?.lics),
    },
  ];

  // Product Card Component
  const ProductCard = ({ item }: { item: any }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-gray-300">
      <div className="flex flex-col sm:flex-row">
        {/* Product Image */}
        <div className="sm:w-56 h-44 sm:h-auto relative flex-shrink-0 bg-gray-100">
          <Link href={`/product-details/${item.slug}`}>
            <Image
              src={
                item.product_preview_file
                  ? `${process.env.NEXT_PUBLIC_S3BUCKET}/${item.product_preview_file}`
                  : "/images/listings/product-draft-default.png"
              }
              alt={item.product_name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          </Link>
          {/* License Badge */}
          {item.lics?.[0]?.meta?.license_type && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 shadow-sm">
                <ShieldCheck size={12} />
                {item.lics[0].meta.license_type}
              </span>
            </div>
          )}
        </div>

        {/* Product Content */}
        <div className="flex-1 p-5">
          <div className="flex flex-col h-full">
            {/* Top Section */}
            <div className="flex-1">
              {/* Category */}
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                {item.primary_category_name}
              </p>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 hover:text-primary transition-colors">
                <Link href={`/product-details/${item.slug}`}>
                  {item.product_name}
                </Link>
              </h3>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400" fill="#facc15" />
                  <span className="text-sm font-medium text-gray-700">
                    {item.avg_rating || 0}
                  </span>
                  <span className="text-sm text-gray-400">
                    ({item.total_reviews || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Author & Purchase Date */}
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Image
                    src={
                      item.creator_meta?.profile_image
                        ? `${process.env.NEXT_PUBLIC_S3BUCKET}/${item.creator_meta.profile_image}`
                        : "/images/user-placeholder.jpg"
                    }
                    alt={item.author_name || "Author"}
                    width={24}
                    height={24}
                    className="rounded-full"
                    unoptimized
                  />
                  <Link
                    href={`/${item.creator_meta?.user_name}`}
                    className="text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    {item.author_name}
                  </Link>
                </div>
                {item.lics?.[0]?.created_at && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <Calendar size={14} />
                    <span>{dateFormat(item.lics[0].created_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-4">
              <div className="text-xs text-gray-400 font-mono truncate max-w-[180px]">
                {item.lics?.[0]?.license_code}
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/product-details/${item.slug}`}>
                  <Button size="small" icon={<Eye size={14} />}>
                    View
                  </Button>
                </Link>
                <Dropdown
                  menu={{ items: getDropdownItems(item) }}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <Button size="small" type="primary" icon={<Download size={14} />}>
                    Download
                  </Button>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading State
  if (isLoading) {
    return (
      <section className="pt-4 pb-8">
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="mb-6">
            <Skeleton.Input active style={{ width: 200, marginBottom: 8 }} />
            <Skeleton.Input active size="small" style={{ width: 100 }} />
          </div>
          {/* Search Skeleton */}
          <div className="mb-6">
            <Skeleton.Input active style={{ width: 300 }} />
          </div>
          {/* Cards Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex gap-5">
                  <Skeleton.Image active style={{ width: 224, height: 160 }} />
                  <div className="flex-1">
                    <Skeleton active paragraph={{ rows: 4 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Empty State
  if (purchasedItems.length === 0) {
    return (
      <section className="pt-4 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
              <Image
                src="/images/empty-icon/purchased-products.svg"
                alt="No Products"
                width={80}
                height={80}
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Purchased Products Yet
            </h2>
            <p className="text-gray-500 mb-6">
              You haven't purchased any products yet. Start exploring our
              collection and find something you love!
            </p>
            <Link href="/marketplace">
              <Button type="primary" size="large">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-4 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Purchased Products
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {totalCount} product{totalCount !== 1 ? "s" : ""} in your library
            </p>
          </div>
          {/* Search */}
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search products..."
              prefix={<Search size={16} className="text-gray-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item: any) => (
              <ProductCard key={item.id} item={item} />
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Search size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">
                No products found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalCount > 10 && !searchQuery && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              total={totalCount}
              pageSize={10}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total) => `${total} products`}
            />
          </div>
        )}
      </div>
    </section>
  );
}
