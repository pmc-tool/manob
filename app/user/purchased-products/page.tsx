"use client";
import { Card, Button, Dropdown, Tag, Skeleton, Pagination } from "antd";
import type { MenuProps } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Download, Eye, Star, FileCode, FileText, Package } from "lucide-react";
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
    creator_meta: { user_name: "techcraft" },
    avg_rating: 4.8,
    total_reviews: 124,
    lics: [{ id: "lic-001", license_code: "PMC-2024-XXXX-XXXX", meta: { license_type: "Regular" }, created_at: "2024-12-10T10:30:00Z" }],
  },
  {
    id: "prod-002",
    product_name: "E-commerce Website Complete Package",
    product_preview_file: null,
    slug: "ecommerce-website-package",
    primary_category_name: "Website Templates",
    author_name: "WebDev Pro",
    creator_meta: { user_name: "webdevpro" },
    avg_rating: 4.9,
    total_reviews: 89,
    lics: [{ id: "lic-002", license_code: "PMC-2024-YYYY-YYYY", meta: { license_type: "Extended" }, created_at: "2024-12-05T14:20:00Z" }],
  },
  {
    id: "prod-003",
    product_name: "Mobile App UI Kit - iOS & Android",
    product_preview_file: null,
    slug: "mobile-app-ui-kit",
    primary_category_name: "UI Kits",
    author_name: "DesignMaster",
    creator_meta: { user_name: "designmaster" },
    avg_rating: 4.7,
    total_reviews: 56,
    lics: [{ id: "lic-003", license_code: "PMC-2024-ZZZZ-ZZZZ", meta: { license_type: "Regular" }, created_at: "2024-11-28T09:15:00Z" }],
  },
];

export default function PurchasedProducts() {
  const [currentPage, setCurrentPage] = useState(1);
  const token = useSelector((state: any) => state.auth?.accessToken);

  const { data: apiData, isLoading, error } = useGetPurchaseProductsQuery({
    page: currentPage,
    limit: "10",
  });

  // Use mock data if API returns no data
  const purchasedItems = apiData && apiData.length > 0 ? apiData : mockPurchasedProducts;
  const totalCount = apiData?.pagination?.total_count || mockPurchasedProducts.length;

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

  if (isLoading) {
    return (
      <section className="pt-4 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Skeleton.Input active style={{ width: 200 }} />
            </div>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="mb-4">
                <div className="flex gap-4">
                  <Skeleton.Image active style={{ width: 180, height: 120 }} />
                  <div className="flex-1">
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (purchasedItems.length === 0) {
    return (
      <section className="pt-4 pb-8">
        <div className="container mx-auto px-4 text-center">
          <Image
            src="/images/empty-icon/purchased-products.svg"
            alt="Not Found"
            width={150}
            height={150}
            className="mx-auto"
          />
          <div className="mt-4">
            <h3 className="text-lg font-semibold">No Purchased Products Yet</h3>
            <p className="text-gray-500 mt-1">
              You haven't purchased any products yet. Start exploring our
              <br className="hidden sm:block" /> collection and find something you love!
            </p>
            <Link href="/marketplace" className="inline-block mt-4">
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Package size={20} className="text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-medium">Purchased Products</h1>
              <p className="text-gray-500 text-sm">{totalCount} products</p>
            </div>
          </div>

          {/* Products List */}
          <div className="space-y-4">
            {purchasedItems.map((item: any) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="sm:w-44 h-32 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Link href={`/product-details/${item.slug}`}>
                      <Image
                        src={
                          item.product_preview_file
                            ? `${process.env.NEXT_PUBLIC_S3BUCKET}/${item.product_preview_file}`
                            : "/images/listings/product-draft-default.png"
                        }
                        alt={item.product_name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </Link>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        {/* Category */}
                        <p className="text-sm text-gray-500 mb-1">{item.primary_category_name}</p>

                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                          <Link href={`/product-details/${item.slug}`} className="hover:text-primary">
                            {item.product_name}
                          </Link>
                        </h3>

                        {/* Author & Rating */}
                        <div className="flex items-center gap-4 text-sm mb-3">
                          <span className="text-gray-600">
                            by{" "}
                            <Link href={`/${item.creator_meta?.user_name}`} className="font-medium hover:text-primary">
                              {item.author_name}
                            </Link>
                          </span>
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-yellow-400" fill="#facc15" />
                            <span className="font-medium">{item.avg_rating || 0}</span>
                            <span className="text-gray-400">({item.total_reviews || 0})</span>
                          </div>
                        </div>

                        {/* License Info */}
                        {item.lics?.[0] && (
                          <div className="flex items-center gap-2 text-sm">
                            <Tag color="blue">{item.lics[0].meta?.license_type || "Regular"} License</Tag>
                            <span className="text-gray-400">
                              Purchased {dateFormat(item.lics[0].created_at)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                        <Link href={`/product-details/${item.slug}`}>
                          <Button icon={<Eye size={16} />}>View</Button>
                        </Link>
                        <Dropdown
                          menu={{ items: getDropdownItems(item) }}
                          trigger={["click"]}
                          placement="bottomRight"
                        >
                          <Button type="primary" icon={<Download size={16} />}>
                            Download
                          </Button>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalCount > 10 && (
            <div className="flex justify-center mt-6">
              <Pagination
                current={currentPage}
                total={totalCount}
                pageSize={10}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
