"use client";
import { Table, Button, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useGetMyRequestQuery } from "@/state/services/user-service/refund.service";
import { dateFormat } from "@/utils/dateFormat";

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "green";
    case "PENDING":
      return "orange";
    case "REJECTED":
      return "red";
    case "CANCELLED":
      return "default";
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

export default function RefundList() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading } = useGetMyRequestQuery({
    page: currentPage,
    limit: 10,
  });

  const refundList = data?.items || [];
  const pagination = data?.pagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnsType<any> = [
    {
      title: "S/N",
      key: "index",
      width: 60,
      render: (_, __, index) => (currentPage - 1) * 10 + index + 1,
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      render: (text, record) => (
        <Link
          href={`/user/refund-details/${record?.id}`}
          className="font-medium text-primary hover:underline"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount_requested",
      key: "amount",
      width: 120,
      render: (amount) => <span className="font-medium">${amount || 0}</span>,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (reason) => (
        <span className="text-gray-600 line-clamp-1">{reason}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "updated_at",
      key: "date",
      width: 120,
      render: (date) => <span className="text-gray-500">{dateFormat(date)}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{formatStatus(status)}</Tag>
      ),
    },
  ];

  if (refundList.length === 0 && !isLoading) {
    return (
      <section className="pt-4 pb-8">
        <div className="container mx-auto px-4 text-center">
          <Image
            src="/images/empty-icon/refund-2.svg"
            alt="Not Found"
            width={150}
            height={150}
            className="mx-auto"
          />
          <div className="mt-4">
            <h3 className="text-lg font-semibold">No Refund Requests Found</h3>
            <p className="text-gray-500 mt-1">
              There are currently no refund requests in the list. Please check
              <br className="hidden sm:block" /> back later or ensure your filters are set correctly.
            </p>
            <Link href="/user/refund-request" className="inline-block mt-4">
              <Button type="primary" icon={<Plus size={16} />} className="rounded-full">
                Request a refund
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-medium">Refunds Requested on Purchased Items</h1>
            <p className="text-gray-500 text-sm">{pagination?.total_count || 0} requests</p>
          </div>
          <Link href="/user/refund-request">
            <Button type="primary" icon={<Plus size={16} />} className="rounded-full">
              Request a refund
            </Button>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <Table
            columns={columns}
            dataSource={refundList}
            rowKey="id"
            loading={isLoading}
            pagination={{
              current: currentPage,
              total: pagination?.total_count || 0,
              pageSize: 10,
              onChange: handlePageChange,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} requests`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
