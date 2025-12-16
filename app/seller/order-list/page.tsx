"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  Table,
  Tag,
  Select,
  DatePicker,
  Empty,
  Skeleton,
  Button,
  Dropdown,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import {
  ShoppingBag,
  Eye,
  MessageSquare,
  Calendar,
  MoreVertical,
} from "lucide-react";
import dayjs from "dayjs";
import { useGetSellerServiceOrdersQuery } from "@/state/services/seller-service/service-order.service";

const { RangePicker } = DatePicker;

// Mock data for development
const mockOrdersData = {
  items: [
    {
      id: "1",
      order_id: "ORD-2024-001",
      service_title: "Professional Logo Design",
      selling_price: 150,
      order_status: "IN_PROGRESS",
      created_at: "2024-12-15T10:30:00Z",
      buyer_info: {
        first_name: "John",
        last_name: "Smith",
        profile_image: null,
      },
    },
    {
      id: "2",
      order_id: "ORD-2024-002",
      service_title: "Website Development",
      selling_price: 500,
      order_status: "PENDING",
      created_at: "2024-12-14T14:20:00Z",
      buyer_info: {
        first_name: "Sarah",
        last_name: "Johnson",
        profile_image: null,
      },
    },
    {
      id: "3",
      order_id: "ORD-2024-003",
      service_title: "Mobile App UI Design",
      selling_price: 300,
      order_status: "COMPLETED",
      created_at: "2024-12-13T09:15:00Z",
      buyer_info: {
        first_name: "Mike",
        last_name: "Brown",
        profile_image: null,
      },
    },
    {
      id: "4",
      order_id: "ORD-2024-004",
      service_title: "SEO Optimization",
      selling_price: 200,
      order_status: "CANCELLED",
      created_at: "2024-12-12T16:45:00Z",
      buyer_info: {
        first_name: "Emma",
        last_name: "Wilson",
        profile_image: null,
      },
    },
  ],
  pagination: {
    total_count: 24,
    current_page: 1,
    total_pages: 3,
    limit: 10,
  },
};

const statusOptions = [
  { value: "ALL", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const getStatusConfig = (status: string) => {
  const config: Record<string, { color: string; label: string }> = {
    PENDING: { color: "warning", label: "Pending" },
    IN_PROGRESS: { color: "processing", label: "In Progress" },
    COMPLETED: { color: "success", label: "Completed" },
    CANCELLED: { color: "error", label: "Cancelled" },
    DELIVERED: { color: "cyan", label: "Delivered" },
    REVISION: { color: "orange", label: "Revision" },
  };
  return config[status] || { color: "default", label: status?.replace(/_/g, " ") };
};

interface OrderItem {
  id: string;
  order_id: string;
  service_title: string;
  selling_price: number;
  order_status: string;
  created_at: string;
  buyer_info?: {
    first_name: string;
    last_name: string;
    profile_image: string | null;
  };
}

export default function SellerOrderListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);

  // Build query string
  const buildQueryString = () => {
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("limit", "10");
    if (statusFilter !== "ALL") params.append("status", statusFilter);
    if (dateRange?.[0]) params.append("start_date", dateRange[0].format("YYYY-MM-DD"));
    if (dateRange?.[1]) params.append("end_date", dateRange[1].format("YYYY-MM-DD"));
    return `?${params.toString()}`;
  };

  const { data: ordersResponse, isLoading } = useGetSellerServiceOrdersQuery(
    buildQueryString()
  );

  // Use mock data if API returns no data
  const ordersData = ordersResponse || mockOrdersData;
  const ordersList: OrderItem[] = ordersData?.items || [];
  const pagination = ordersData?.pagination;

  const getDropdownItems = (order: OrderItem): MenuProps["items"] => [
    {
      key: "view",
      label: (
        <Link
          href={`/seller/order-list/${order.id}`}
          className="flex items-center gap-2"
        >
          <Eye size={14} />
          View Details
        </Link>
      ),
    },
    {
      key: "message",
      label: (
        <Link href="/chat" className="flex items-center gap-2">
          <MessageSquare size={14} />
          Message Buyer
        </Link>
      ),
    },
  ];

  const columns: ColumnsType<OrderItem> = [
    {
      title: "#",
      key: "index",
      width: 50,
      render: (_, __, index) => (
        <span className="text-gray-500 text-sm">
          {(currentPage - 1) * 10 + index + 1}
        </span>
      ),
    },
    {
      title: "Client",
      key: "client",
      width: 180,
      render: (_, record) => {
        const buyer = record.buyer_info;
        const fullName = buyer
          ? `${buyer.first_name} ${buyer.last_name}`
          : "Unknown";
        return (
          <div className="flex items-center gap-3">
            <Image
              src={
                buyer?.profile_image
                  ? buyer.profile_image.includes("https")
                    ? buyer.profile_image
                    : `${process.env.NEXT_PUBLIC_S3BUCKET}/${buyer.profile_image}`
                  : "/images/user-placeholder.jpg"
              }
              alt={fullName}
              width={36}
              height={36}
              className="rounded-full object-cover"
              unoptimized
            />
            <span className="font-medium text-gray-900 text-sm">{fullName}</span>
          </div>
        );
      },
    },
    {
      title: "Service",
      dataIndex: "service_title",
      key: "service_title",
      render: (title) => (
        <span className="font-medium text-gray-900 line-clamp-1">{title}</span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "created_at",
      key: "created_at",
      width: 140,
      render: (date) => (
        <div>
          <div className="text-sm text-gray-900">
            {dayjs(date).format("MMM DD, YYYY")}
          </div>
          <div className="text-xs text-gray-400">
            {dayjs(date).format("hh:mm A")}
          </div>
        </div>
      ),
    },
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
      width: 140,
      render: (orderId) => (
        <span className="font-mono text-sm text-gray-600">#{orderId}</span>
      ),
    },
    {
      title: "Price",
      dataIndex: "selling_price",
      key: "selling_price",
      width: 100,
      render: (price) => (
        <span className="font-semibold text-gray-900">${price}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "order_status",
      key: "order_status",
      width: 130,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <div className="flex items-center gap-1 justify-end">
          <Tooltip title="View Details">
            <Link href={`/seller/order-list/${record.id}`}>
              <Button type="text" size="small" icon={<Eye size={16} />} />
            </Link>
          </Tooltip>
          <Dropdown
            menu={{ items: getDropdownItems(record) }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button type="text" size="small" icon={<MoreVertical size={16} />} />
          </Dropdown>
        </div>
      ),
    },
  ];

  // Stats
  const totalOrders = pagination?.total_count || ordersList.length;
  const pendingOrders = ordersList.filter((o) => o.order_status === "PENDING").length;
  const inProgressOrders = ordersList.filter((o) => o.order_status === "IN_PROGRESS").length;

  // Empty state check
  const isEmptyState =
    ordersList.length === 0 &&
    currentPage === 1 &&
    statusFilter === "ALL" &&
    !dateRange;

  if (isEmptyState && !isLoading) {
    return (
      <section className="p-4 md:p-6">
        <div className="max-w-md mx-auto text-center py-16">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
            <Image
              src="/images/empty-icon/order-list.svg"
              alt="No Orders"
              width={80}
              height={80}
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Orders List is Empty
          </h2>
          <p className="text-gray-500 mb-6">
            It looks like you haven't received any orders yet. Once buyers
            purchase your services, orders will appear here for easy tracking.
          </p>
          <Link href="/seller/service-list">
            <Button type="primary" size="large">
              Manage Services
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <ShoppingBag size={24} className="text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders List</h1>
              <p className="text-gray-500 text-sm">{totalOrders} total orders</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="border-gray-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>
          </Card>
          <Card className="border-gray-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{pendingOrders}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </Card>
          <Card className="border-gray-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{inProgressOrders}</p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={16} />
              <span>Filters:</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                options={statusOptions}
                style={{ width: 150 }}
                placeholder="Status"
              />
              <RangePicker
                value={dateRange}
                onChange={(dates) => {
                  setDateRange(dates);
                  setCurrentPage(1);
                }}
                placeholder={["Start Date", "End Date"]}
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
              />
            </div>
          </div>
        </Card>

        {/* Orders Table */}
        <Card>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} active avatar paragraph={{ rows: 1 }} />
              ))}
            </div>
          ) : ordersList.length > 0 ? (
            <Table
              columns={columns}
              dataSource={ordersList}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize: 10,
                total: pagination?.total_count || 0,
                showSizeChanger: false,
                showTotal: (total) => `${total} orders`,
                onChange: (page) => setCurrentPage(page),
              }}
              scroll={{ x: 900 }}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No orders found for the selected filters"
            />
          )}
        </Card>
      </div>
    </section>
  );
}
