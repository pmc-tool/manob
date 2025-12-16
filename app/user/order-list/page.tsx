"use client";
import { Table, Select, Avatar, Button, Empty, Tooltip, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, Edit, MessageCircle } from "lucide-react";
import { useGetUserServiceOrdersQuery } from "@/state/services/user-service/service-order.service";
import { dateFormat, getTime } from "@/utils/dateFormat";
import useOrders from "@/hooks/orders";

const statusOptions = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "COMPLETED", label: "Completed" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "orange";
    case "IN_PROGRESS":
      return "blue";
    case "COMPLETED":
      return "green";
    case "CANCELLED":
      return "red";
    case "PAID":
      return "cyan";
    default:
      return "default";
  }
};

const formatStatus = (status: string) => {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
};

export default function OrderListPage() {
  const [selectedOption, setSelectedOption] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState([null, null]);
  const { simpleListFilter } = useOrders();

  const url = simpleListFilter({
    currentPage,
    limit: "20",
    start_date: dateRange[0],
    end_date: dateRange[1],
    status: selectedOption,
  });

  const {
    data: userServiceOrders,
    isLoading,
    error,
  } = useGetUserServiceOrdersQuery(url);

  const serviceOrderList = userServiceOrders?.items || [];
  const pagination = userServiceOrders?.pagination;

  const handleSelect = (value: string) => {
    setCurrentPage(1);
    setSelectedOption(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnsType<any> = [
    {
      title: "S/N",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Seller",
      key: "seller",
      width: 180,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar
            src={
              record?.seller_info?.profile_image
                ? `${process.env.NEXT_PUBLIC_S3BUCKET}/${record?.seller_info?.profile_image}`
                : "/images/user-placeholder.jpg"
            }
            size={36}
          />
          <span className="font-medium">
            {`${record?.seller_info?.first_name} ${record?.seller_info?.last_name}`}
          </span>
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "service_title",
      key: "name",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Date & Time",
      key: "datetime",
      width: 140,
      render: (_, record) => (
        <div>
          <div className="font-medium">{dateFormat(record?.created_at)}</div>
          <div className="text-gray-500 text-sm">{getTime(record?.created_at)}</div>
        </div>
      ),
    },
    {
      title: "Order Id",
      dataIndex: "order_id",
      key: "orderId",
      render: (id) => <span>#{id}</span>,
    },
    {
      title: "Price",
      dataIndex: "selling_price",
      key: "price",
      render: (price) => <span className="font-medium">${price}</span>,
    },
    {
      title: "Status",
      dataIndex: "order_status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{formatStatus(status)}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      align: "right",
      render: (_, record) => (
        <div className="flex gap-2 justify-end">
          {record?.order_status === "PAID" && (
            <Tooltip title="Edit to complete">
              <Link href={`/service-payment/complete-order/${record?.id}`}>
                <Button size="small" type="primary" icon={<Edit size={14} />} className="!bg-green-500 !border-green-500" />
              </Link>
            </Tooltip>
          )}
          <Tooltip title="View">
            <Link href={`/user/order-list/${record?.id}`}>
              <Button size="small" icon={<Eye size={14} />} />
            </Link>
          </Tooltip>
          <Tooltip title="Message">
            <Link href="/chat">
              <Button size="small" icon={<MessageCircle size={14} />} />
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];

  if (serviceOrderList.length === 0 && !isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto text-center">
          <Image
            src="/images/empty-icon/order-list.svg"
            alt="Not Found"
            width={150}
            height={150}
            className="mx-auto"
          />
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Orders List is Empty</h3>
            <p className="text-gray-500 mt-1">
              It looks like you haven't placed any orders yet. Once you make
              <br className="hidden sm:block" /> a purchase, your orders
              will appear here for easy tracking and management.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-4 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-xl font-medium">My Orders</h1>
          </div>
          <div>
            <Select
              value={selectedOption}
              onChange={handleSelect}
              options={statusOptions}
              style={{ width: 150 }}
              placeholder="Filter by status"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <Table
            columns={columns}
            dataSource={serviceOrderList}
            rowKey="id"
            loading={isLoading}
            pagination={{
              current: currentPage,
              total: pagination?.total_count || 0,
              pageSize: 20,
              onChange: handlePageChange,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} orders`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
