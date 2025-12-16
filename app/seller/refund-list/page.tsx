"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Empty, Skeleton, Pagination, Tag } from "antd";
import { ReceiptText, ChevronRight } from "lucide-react";
import { useGetRefundsQuery } from "@/state/services/seller-service/refund.service";
import { dateFormat } from "@/utils/dateFormat";

interface RefundItem {
  id: string;
  product_name: string;
  status: string;
  updated_at: string;
  amount_requested: number;
}

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "warning";
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "error";
    case "IN_PROGRESS":
      return "processing";
    default:
      return "default";
  }
};

const formatStatus = (status: string) => {
  if (!status) return "";
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
};

export default function SellerRefundListPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const { data, isLoading } = useGetRefundsQuery({ page: currentPage, limit: pageSize });
  const refundList: RefundItem[] = data?.items || [];
  const pagination = data?.pagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <section className="p-6">
        <div className="max-w-5xl mx-auto">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </section>
    );
  }

  return (
    <section className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <ReceiptText size={20} className="text-orange-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Refund Requests</h1>
          </div>
          <p className="text-gray-500">
            Refund requests made against items you sold
          </p>
        </div>

        {refundList.length > 0 ? (
          <>
            <Card className="overflow-hidden">
              <div className="divide-y divide-gray-100">
                {refundList.map((item) => (
                  <Link
                    key={item.id}
                    href={`/seller/refund-details/${item.id}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors truncate">
                        {item.product_name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Requested: ${item.amount_requested || 0}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                      <span className="text-sm text-gray-500 hidden sm:block">
                        {dateFormat(item.updated_at)}
                      </span>
                      <Tag color={getStatusColor(item.status)}>
                        {formatStatus(item.status)}
                      </Tag>
                      <ChevronRight
                        size={18}
                        className="text-gray-400 group-hover:text-primary transition-colors"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {pagination?.total_count > pageSize && (
              <div className="flex justify-center mt-6">
                <Pagination
                  current={currentPage}
                  total={pagination?.total_count || 0}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        ) : (
          <Card className="text-center py-16">
            <Empty
              image={
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <ReceiptText size={48} className="text-gray-400" />
                </div>
              }
              description={
                <div className="mt-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    No Refund Requests Found
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    There are currently no refund requests in the list. Please check
                    back later or ensure your filters are set correctly.
                  </p>
                </div>
              }
            />
          </Card>
        )}
      </div>
    </section>
  );
}
