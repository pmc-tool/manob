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
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { History, MessageSquare, Calendar, TrendingUp } from "lucide-react";
import dayjs from "dayjs";
import { useGetOrderHistoryQuery } from "@/state/services/seller-service/service-order.service";

const { RangePicker } = DatePicker;

// Mock data for development
const mockHistoryData = {
  data: {
    items: [
      {
        id: "1",
        order_id: "ORD-2024-001",
        item_meta: { name: "Premium Dashboard Template" },
        selling_price: 79,
        created_at: "2024-12-15T10:30:00Z",
        buyer_meta: {
          name: "John Smith",
          avatar: null,
          user_id: "user-1",
        },
      },
      {
        id: "2",
        order_id: "ORD-2024-002",
        item_meta: { name: "E-commerce Website Package" },
        selling_price: 199,
        created_at: "2024-12-14T14:20:00Z",
        buyer_meta: {
          name: "Sarah Johnson",
          avatar: null,
          user_id: "user-2",
        },
      },
      {
        id: "3",
        order_id: "ORD-2024-003",
        item_meta: { name: "Logo Design Service" },
        selling_price: 50,
        created_at: "2024-12-13T09:15:00Z",
        buyer_meta: {
          name: "Mike Brown",
          avatar: null,
          user_id: "user-3",
        },
      },
      {
        id: "4",
        order_id: "ORD-2024-004",
        item_meta: { name: "Mobile App UI Kit" },
        selling_price: 129,
        created_at: "2024-12-12T16:45:00Z",
        buyer_meta: {
          name: "Emma Wilson",
          avatar: null,
          user_id: "user-4",
        },
      },
      {
        id: "5",
        order_id: "ORD-2024-005",
        item_meta: { name: "WordPress Theme Development" },
        selling_price: 299,
        created_at: "2024-12-11T11:00:00Z",
        buyer_meta: {
          name: "David Lee",
          avatar: null,
          user_id: "user-5",
        },
      },
    ],
    pagination: {
      total_count: 45,
      current_page: 1,
      total_pages: 5,
      limit: 10,
    },
  },
};

const typeOptions = [
  { value: "PRODUCT", label: "Product" },
  { value: "SERVICE", label: "Service" },
];

interface HistoryItem {
  id: string;
  order_id: string;
  item_meta?: { name: string };
  selling_price: number;
  created_at: string;
  buyer_meta?: {
    name: string;
    avatar: string | null;
    user_id: string;
  };
}

export default function SellerSellHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [orderType, setOrderType] = useState("PRODUCT");
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);

  // Build query string
  const buildQueryString = () => {
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("limit", "10");
    params.append("order_type", orderType);
    if (dateRange?.[0]) params.append("start_date", dateRange[0].format("YYYY-MM-DD"));
    if (dateRange?.[1]) params.append("end_date", dateRange[1].format("YYYY-MM-DD"));
    return `?${params.toString()}`;
  };

  const { data: historyResponse, isLoading } = useGetOrderHistoryQuery(
    buildQueryString()
  );

  // Use mock data if API returns no data
  const historyData = historyResponse?.data || mockHistoryData.data;
  const historyList: HistoryItem[] = historyData?.items || [];
  const pagination = historyData?.pagination;

  // Calculate totals
  const totalSales = pagination?.total_count || historyList.length;
  const totalRevenue = historyList.reduce((sum, item) => sum + (item.selling_price || 0), 0);

  const columns: ColumnsType<HistoryItem> = [
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
        const buyer = record.buyer_meta;
        return (
          <div className="flex items-center gap-3">
            <Image
              src={
                buyer?.avatar
                  ? `${process.env.NEXT_PUBLIC_S3BUCKET}/${buyer.avatar}`
                  : "/images/user-placeholder.jpg"
              }
              alt={buyer?.name || "Client"}
              width={36}
              height={36}
              className="rounded-full object-cover"
              unoptimized
            />
            <span className="font-medium text-gray-900 text-sm">
              {buyer?.name || "Unknown"}
            </span>
          </div>
        );
      },
    },
    {
      title: "Item Name",
      key: "item_name",
      render: (_, record) => (
        <span className="font-medium text-gray-900 line-clamp-1">
          {record.item_meta?.name || "N/A"}
        </span>
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
        <span className="font-mono text-sm text-gray-600">{orderId}</span>
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
      title: "Type",
      key: "type",
      width: 100,
      render: () => (
        <Tag color={orderType === "PRODUCT" ? "blue" : "purple"}>
          {orderType}
        </Tag>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 50,
      render: (_, record) => (
        <Tooltip title="Message Buyer">
          <Link href="/chat">
            <Button type="text" size="small" icon={<MessageSquare size={16} />} />
          </Link>
        </Tooltip>
      ),
    },
  ];

  // Empty state
  if (historyList.length === 0 && !isLoading) {
    return (
      <section className="p-4 md:p-6">
        <div className="max-w-md mx-auto text-center py-16">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
            <Image
              src="/images/empty-icon/sell-history.svg"
              alt="No History"
              width={80}
              height={80}
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Sell History Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            We couldn't find any records of your previous sales. Start selling
            products or services to generate history.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/seller/product-list">
              <Button>View Products</Button>
            </Link>
            <Link href="/seller/service-list">
              <Button type="primary">View Services</Button>
            </Link>
          </div>
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
              <History size={24} className="text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sell History</h1>
              <p className="text-gray-500 text-sm">
                Track your completed sales
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card className="border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <History size={24} className="text-gray-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{totalSales}</p>
                <p className="text-sm text-gray-500">Total Sales</p>
              </div>
            </div>
          </Card>
          <Card className="border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <TrendingUp size={24} className="text-gray-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  ${totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Page Revenue</p>
              </div>
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
                value={orderType}
                onChange={(value) => {
                  setOrderType(value);
                  setCurrentPage(1);
                }}
                options={typeOptions}
                style={{ width: 140 }}
                placeholder="Type"
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

        {/* History Table */}
        <Card>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} active avatar paragraph={{ rows: 1 }} />
              ))}
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={historyList}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize: 10,
                total: pagination?.total_count || 0,
                showSizeChanger: false,
                showTotal: (total) => `${total} sales`,
                onChange: (page) => setCurrentPage(page),
              }}
              scroll={{ x: 900 }}
            />
          )}
        </Card>
      </div>
    </section>
  );
}
