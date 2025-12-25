"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, Button, Select, Empty, Skeleton, Pagination, Tag, Modal, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  Plus,
  Star,
  Pencil,
  Trash2,
  MoreVertical,
  Briefcase,
  HelpCircle,
  Clock,
  XCircle,
  ListOrdered,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetServicesQuery,
  useDeleteServiceMutation,
} from "@/state/services/seller-service/service.service";

// Mock data for development
const mockServices = {
  items: [
    {
      id: "1",
      service_title: "Professional Logo Design Service",
      thumbnail: "/images/placeholder-service.jpg",
      status: "PUBLISHED",
      basic_price: 49,
      avg_rating: 4.8,
      total_reviews: 24,
      order_queue: 3,
      cancel_rate: "2%",
      category: { name: "Graphics & Design" },
      created_at: "2024-12-01",
    },
    {
      id: "2",
      service_title: "Website Development with React & Next.js",
      thumbnail: "/images/placeholder-service.jpg",
      status: "PUBLISHED",
      basic_price: 199,
      avg_rating: 5.0,
      total_reviews: 12,
      order_queue: 1,
      cancel_rate: "0%",
      category: { name: "Programming & Tech" },
      created_at: "2024-11-28",
    },
    {
      id: "3",
      service_title: "Social Media Marketing Strategy",
      thumbnail: "/images/placeholder-service.jpg",
      status: "ON_REVIEW",
      basic_price: 79,
      avg_rating: 0,
      total_reviews: 0,
      order_queue: 0,
      cancel_rate: "0%",
      category: { name: "Digital Marketing" },
      created_at: "2024-12-10",
    },
    {
      id: "4",
      service_title: "Mobile App UI/UX Design",
      thumbnail: "/images/placeholder-service.jpg",
      status: "DRAFT",
      basic_price: 149,
      avg_rating: 0,
      total_reviews: 0,
      order_queue: 0,
      cancel_rate: "0%",
      category: { name: "Graphics & Design" },
      created_at: "2024-12-12",
    },
  ],
  meta: {
    total: 4,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
};

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "PUBLISHED", label: "Active" },
  { value: "ON_REVIEW", label: "Pending Review" },
  { value: "DRAFT", label: "Draft" },
];

const sortOptions = [
  { value: "price_desc", label: "Price: High to Low" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "date_desc", label: "Date: Newest First" },
  { value: "date_asc", label: "Date: Oldest First" },
];

const getStatusConfig = (status: string) => {
  const config: Record<string, { color: string; label: string }> = {
    PUBLISHED: { color: "success", label: "Active" },
    ON_REVIEW: { color: "warning", label: "Pending Review" },
    DRAFT: { color: "default", label: "Draft" },
  };
  return config[status] || { color: "default", label: status };
};

interface Service {
  id: string;
  service_title: string;
  thumbnail?: string;
  status: string;
  basic_price: number;
  avg_rating: number;
  total_reviews: number;
  order_queue: number;
  cancel_rate: string;
  category?: { name: string };
  created_at: string;
}

export default function SellerServiceListPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { data: servicesData, isLoading, refetch } = useGetServicesQuery({
    page: currentPage,
    limit: "10",
    status: statusFilter,
    sortLabel: sortBy,
  });

  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  // Use mock data if API returns no data
  const services = servicesData || mockServices;
  const serviceList: Service[] = services.items || [];
  const totalServices = services.meta?.total || 0;

  const handleCreateService = () => {
    router.push("/seller/service-add");
  };

  const handleEditService = (service: Service) => {
    if (service.status === "DRAFT") {
      router.push(`/seller/service-add?id=${service.id}`);
    } else {
      router.push(`/seller/service-edit/${service.id}`);
    }
  };

  const handleDeleteClick = (service: Service) => {
    setSelectedService(service);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedService) return;
    try {
      await deleteService(selectedService.id).unwrap();
      toast.success("Service deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete service");
    }
    setDeleteModalOpen(false);
    setSelectedService(null);
  };

  const getDropdownItems = (service: Service): MenuProps["items"] => [
    {
      key: "delete",
      label: "Delete",
      icon: <Trash2 size={16} />,
      danger: true,
      onClick: () => handleDeleteClick(service),
    },
  ];

  return (
    <section className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Briefcase size={32} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Create a Service</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Start offering your skills and services to buyers worldwide
                </p>
                <Button
                  type="primary"
                  icon={<Plus size={16} />}
                  size="large"
                  block
                  onClick={handleCreateService}
                >
                  Create Service
                </Button>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                  href="/help/services"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary"
                >
                  <HelpCircle size={16} />
                  Need help creating a service?
                </Link>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
                <Tag color="blue">{totalServices} Total</Tag>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={statusOptions}
                  style={{ width: 150 }}
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

            {/* Service List */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <Skeleton active avatar={{ shape: "square", size: 120 }} paragraph={{ rows: 2 }} />
                  </Card>
                ))}
              </div>
            ) : serviceList.length > 0 ? (
              <div className="space-y-4">
                {serviceList.map((service) => (
                  <Card
                    key={service.id}
                    className="hover:shadow-md transition-shadow"
                    bodyStyle={{ padding: 0 }}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Thumbnail */}
                      <div className="sm:w-48 h-32 sm:h-auto relative flex-shrink-0">
                        <div className="w-full h-full sm:h-36 bg-gray-100 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none overflow-hidden">
                          {service.thumbnail ? (
                            <Image
                              src={service.thumbnail.includes("http") ? service.thumbnail : `${process.env.NEXT_PUBLIC_S3BUCKET}/${service.thumbnail}`}
                              alt={service.service_title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Briefcase size={40} className="text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="absolute top-2 left-2">
                          <Tag color={getStatusConfig(service.status).color}>
                            {getStatusConfig(service.status).label}
                          </Tag>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {service.category && (
                              <p className="text-xs text-gray-500 mb-1">{service.category.name}</p>
                            )}
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                              {service.service_title}
                            </h3>

                            {/* Stats - Only show for non-draft */}
                            {service.status === "PUBLISHED" && (
                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                <div className="flex items-center gap-1">
                                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                  <span className="font-medium">{service.avg_rating.toFixed(1)}</span>
                                  <span>({service.total_reviews})</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <ListOrdered size={14} />
                                  <span>Queue: {service.order_queue}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <XCircle size={14} />
                                  <span>Cancel: {service.cancel_rate}</span>
                                </div>
                              </div>
                            )}

                            {service.status === "ON_REVIEW" && (
                              <div className="flex items-center gap-1 text-sm text-amber-600 mb-2">
                                <Clock size={14} />
                                <span>Under review by our team</span>
                              </div>
                            )}

                            <p className="text-lg font-bold text-gray-900">
                              From <span className="text-primary">${service.basic_price}</span>
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              type="text"
                              icon={<Pencil size={18} />}
                              onClick={() => handleEditService(service)}
                              title="Edit"
                            />
                            {service.status === "DRAFT" && (
                              <Dropdown menu={{ items: getDropdownItems(service) }} trigger={["click"]}>
                                <Button type="text" icon={<MoreVertical size={18} />} />
                              </Dropdown>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Pagination */}
                {services.meta?.totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <Pagination
                      current={currentPage}
                      total={totalServices}
                      pageSize={10}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </div>
            ) : (
              <Card className="text-center py-16">
                <Empty
                  image={
                    <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                      <Briefcase size={48} className="text-gray-400" />
                    </div>
                  }
                  description={
                    <div className="mt-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">No Services Yet</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        You haven't created any services yet. Start by creating your first service to
                        showcase your skills and attract buyers.
                      </p>
                    </div>
                  }
                >
                  <Button
                    type="primary"
                    size="large"
                    icon={<Plus size={16} />}
                    onClick={handleCreateService}
                    className="mt-4"
                  >
                    Create Your First Service
                  </Button>
                </Empty>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        title="Delete Service"
        footer={
          <div className="flex gap-2 justify-end">
            <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button danger type="primary" onClick={confirmDelete} loading={isDeleting}>
              Delete
            </Button>
          </div>
        }
        centered
      >
        <p className="text-gray-600">
          Are you sure you want to delete "{selectedService?.service_title}"? This action cannot be undone.
        </p>
      </Modal>
    </section>
  );
}
