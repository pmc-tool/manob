"use client";

import { useState, useMemo } from "react";
import { Card, Button, Select, Empty, Spin, Modal, Pagination, Tag, Dropdown, Tooltip } from "antd";
import {
  Plus,
  Package,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Clock,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Mock data for development
const mockProducts = [
  {
    id: "prod-1",
    product_name: "Admin Dashboard Pro - React & Tailwind Template",
    thumbnail_images: "https://picsum.photos/seed/prod1/400/200",
    current_status: "PUBLISHED",
    price: 49,
    mrp: 59,
    sales: 234,
    slug: "admin-dashboard-pro",
    updated_at: "2024-12-15T10:30:00Z",
    is_onsale: true,
    trendingStatus: "trending",
  },
  {
    id: "prod-2",
    product_name: "E-commerce Website Template - Next.js",
    thumbnail_images: "https://picsum.photos/seed/prod2/400/200",
    current_status: "PUBLISHED",
    price: 79,
    sales: 156,
    slug: "ecommerce-nextjs",
    updated_at: "2024-12-10T14:20:00Z",
    is_onsale: false,
  },
  {
    id: "prod-3",
    product_name: "Landing Page Builder Components",
    thumbnail_images: "https://picsum.photos/seed/prod3/400/200",
    current_status: "ON_REVIEW",
    price: 35,
    sales: 0,
    updated_at: "2024-12-16T09:00:00Z",
    is_onsale: false,
  },
  {
    id: "prod-4",
    product_name: "Portfolio Theme - Dark Mode",
    thumbnail_images: null,
    current_status: "DRAFT",
    price: 25,
    sales: 0,
    updated_at: "2024-12-14T16:45:00Z",
    is_onsale: false,
  },
  {
    id: "prod-5",
    product_name: "SaaS Starter Kit - Full Stack",
    thumbnail_images: "https://picsum.photos/seed/prod5/400/200",
    current_status: "PUBLISHED",
    price: 129,
    sales: 89,
    slug: "saas-starter-kit",
    updated_at: "2024-12-08T11:15:00Z",
    is_onsale: false,
    trendingStatus: "trending",
  },
  {
    id: "prod-6",
    product_name: "Blog Theme with CMS Integration",
    thumbnail_images: "https://picsum.photos/seed/prod6/400/200",
    current_status: "REJECTED",
    price: 45,
    sales: 0,
    updated_at: "2024-12-12T08:30:00Z",
    is_onsale: false,
  },
];

const statusOptions = [
  { value: "PUBLISHED", label: "Active" },
  { value: "ON_REVIEW", label: "Pending Review" },
  { value: "DRAFT", label: "Drafts" },
  { value: "REJECTED", label: "Rejected" },
];

const sortOptions = [
  { value: "price_desc", label: "Price: High to Low" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "PUBLISHED":
      return { color: "success", icon: <CheckCircle size={14} />, label: "Active" };
    case "ON_REVIEW":
      return { color: "warning", icon: <Clock size={14} />, label: "Pending Review" };
    case "DRAFT":
      return { color: "default", icon: <FileText size={14} />, label: "Draft" };
    case "REJECTED":
      return { color: "error", icon: <AlertCircle size={14} />, label: "Rejected" };
    default:
      return { color: "default", icon: null, label: status };
  }
};

export default function ProductListPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("PUBLISHED");
  const [sortBy, setSortBy] = useState("date_desc");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // Use mock data for development (filter by status and apply sorting)
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts
      .filter((p) => !deletedIds.includes(p.id))
      .filter((p) => status === "ALL" || p.current_status === status);

    // Sort products
    if (sortBy === "price_desc") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === "price_asc") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === "date_desc") {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    } else if (sortBy === "date_asc") {
      filtered = [...filtered].sort(
        (a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
      );
    }

    return filtered;
  }, [status, sortBy, deletedIds]);

  const isLoading = false;
  const error = null;
  const isDeleting = false;

  const products = filteredProducts;
  const totalCount = filteredProducts.length;
  const perPage = 10;

  const handleEdit = (productId: string) => {
    router.push(`/seller/product-edit/${productId}`);
  };

  const handleDeleteClick = (productId: string, productName: string) => {
    setProductToDelete({ id: productId, name: productName });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    // Mock delete - just remove from local state
    setDeletedIds((prev) => [...prev, productToDelete.id]);
    toast.success("Product deleted successfully");
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 order-last lg:order-first">
            <Card className="sticky top-6">
              <div className="text-center">
                <Package size={40} className="mx-auto text-gray-400 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Upload an Item</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Share your digital products with our global marketplace.
                </p>
                <Link href="/seller/product-add">
                  <Button type="primary" icon={<Plus size={16} />} block size="large">
                    Upload Product
                  </Button>
                </Link>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Need help uploading your items?{" "}
                  <Link href="/faqs" className="text-primary hover:underline">
                    Read our guide
                  </Link>
                </p>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                <h4 className="font-medium text-sm text-gray-900">Quick Stats</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Products</span>
                  <span className="font-medium">{totalCount}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
                <p className="text-gray-500 text-sm mt-1">
                  {totalCount} {totalCount === 1 ? "item" : "items"} total
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Select
                  value={status}
                  onChange={setStatus}
                  options={statusOptions}
                  style={{ width: 160 }}
                  placeholder="Filter by status"
                />
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  options={sortOptions}
                  style={{ width: 180 }}
                  placeholder="Sort by"
                />
              </div>
            </div>

            {/* Products List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Spin size="large" />
              </div>
            ) : error ? (
              <Card className="text-center py-10">
                <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Error loading products</h3>
                <p className="text-gray-500 mt-1">Please try again later</p>
              </Card>
            ) : products.length === 0 ? (
              <Card className="text-center py-16">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                      <p className="text-gray-500">
                        {status === "PUBLISHED"
                          ? "You don't have any active products yet"
                          : `No products with "${statusOptions.find((s) => s.value === status)?.label}" status`}
                      </p>
                    </div>
                  }
                >
                  <Link href="/seller/product-add">
                    <Button type="primary" icon={<Plus size={16} />}>
                      Upload Your First Product
                    </Button>
                  </Link>
                </Empty>
              </Card>
            ) : (
              <div className="space-y-4">
                {products.map((product: any) => {
                  const statusConfig = getStatusConfig(product.current_status);

                  return (
                    <Card
                      key={product.id}
                      className="overflow-hidden hover:shadow-md transition-shadow"
                      bodyStyle={{ padding: 0 }}
                    >
                      <div className="flex flex-col sm:flex-row">
                        {/* Thumbnail */}
                        <div className="sm:w-48 h-36 sm:h-auto relative bg-gray-100 flex-shrink-0">
                          {product.thumbnail_images ? (
                            <Image
                              src={product.thumbnail_images}
                              alt={product.product_name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={40} className="text-gray-300" />
                            </div>
                          )}
                          {product.is_onsale && (
                            <div className="absolute top-2 left-2">
                              <Tag color="red">On Sale</Tag>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Tag
                                  color={statusConfig.color as any}
                                  icon={statusConfig.icon}
                                  className="m-0"
                                >
                                  {statusConfig.label}
                                </Tag>
                                {product.trendingStatus === "trending" && (
                                  <Tooltip title="Trending">
                                    <TrendingUp size={16} className="text-orange-500" />
                                  </Tooltip>
                                )}
                              </div>

                              <h3 className="font-semibold text-gray-900 text-lg truncate">
                                {product.product_name}
                              </h3>

                              {/* Stats Row */}
                              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <DollarSign size={14} />
                                  <span className="font-semibold text-gray-900">
                                    {formatPrice(product.price)}
                                  </span>
                                  {product.mrp && product.price < product.mrp && (
                                    <span className="line-through text-gray-400 ml-1">
                                      {formatPrice(product.mrp)}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <ShoppingCart size={14} />
                                  <span>{product.sales || 0} sales</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock size={14} />
                                  <span>Updated {formatDate(product.updated_at)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              {product.current_status === "PUBLISHED" && product.slug && (
                                <Tooltip title="View Live">
                                  <Link
                                    href={`/product-details/${product.slug}`}
                                    target="_blank"
                                  >
                                    <Button
                                      type="text"
                                      icon={<ExternalLink size={16} />}
                                    />
                                  </Link>
                                </Tooltip>
                              )}
                              <Tooltip title="Preview">
                                <Button
                                  type="text"
                                  icon={<Eye size={16} />}
                                  onClick={() => handleEdit(product.id)}
                                />
                              </Tooltip>
                              <Tooltip title="Edit">
                                <Button
                                  type="text"
                                  icon={<Edit size={16} />}
                                  onClick={() => handleEdit(product.id)}
                                />
                              </Tooltip>
                              <Dropdown
                                menu={{
                                  items: [
                                    {
                                      key: "delete",
                                      label: "Delete",
                                      icon: <Trash2 size={14} />,
                                      danger: true,
                                      onClick: () =>
                                        handleDeleteClick(product.id, product.product_name),
                                    },
                                  ],
                                }}
                                trigger={["click"]}
                              >
                                <Button type="text" icon={<MoreVertical size={16} />} />
                              </Dropdown>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {products.length > 0 && totalCount > perPage && (
              <div className="flex justify-center mt-6">
                <Pagination
                  current={currentPage}
                  total={totalCount}
                  pageSize={perPage}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Product"
        open={deleteModalOpen}
        onCancel={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setDeleteModalOpen(false);
              setProductToDelete(null);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            danger
            type="primary"
            loading={isDeleting}
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>,
        ]}
        centered
      >
        <div className="py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Are you sure?</p>
              <p className="text-sm text-gray-500">This action cannot be undone.</p>
            </div>
          </div>
          {productToDelete && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                You are about to delete: <strong>{productToDelete.name}</strong>
              </p>
            </div>
          )}
        </div>
      </Modal>
    </section>
  );
}
