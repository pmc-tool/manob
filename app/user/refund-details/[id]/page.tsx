"use client";
import { Button, Card, Tag, Modal, Skeleton } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  useGetRequestDetailsQuery,
  useDeleteRequestMutation,
} from "@/state/services/user-service/refund.service";
import { dateFormat, dateAddSixMonth, calculateTimeAgo } from "@/utils/dateFormat";

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "green";
    case "PENDING":
      return "orange";
    case "REJECTED":
      return "red";
    default:
      return "default";
  }
};

const formatStatus = (status: string) => {
  if (status === "REJECTED") return "Rejected";
  if (status === "PENDING") return "Pending";
  if (status === "APPROVED") return "Approved";
  return status;
};

export default function UserRefundDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { data: refundData, isLoading } = useGetRequestDetailsQuery(id);
  const [cancelRequest, { data: cancelData }] = useDeleteRequestMutation();

  const handleCancel = async () => {
    Modal.confirm({
      title: "Are you sure you want to cancel the refund request?",
      content: "If you confirm, the request will be canceled. This action cannot be undone.",
      okText: "Confirm",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        await cancelRequest(id);
      },
    });
  };

  useEffect(() => {
    if (cancelData?.statusCode === 200) {
      toast.success("Canceled the request successfully");
      router.push("/user/refund-list");
    } else if (cancelData?.statusCode === 400) {
      toast.error(cancelData?.message || "Failed to cancel the request!");
    } else if (cancelData?.statusCode === 404) {
      toast.error(cancelData?.message || "Request not found!");
    }
  }, [cancelData, router]);

  if (isLoading) {
    return (
      <section className="pt-4 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <Skeleton active paragraph={{ rows: 8 }} />
            </Card>
            <Card>
              <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-4 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Sidebar - Product Info */}
          <Card className="h-fit">
            {/* Product Image */}
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={
                  refundData?.product_meta?.product_image
                    ? `${process.env.NEXT_PUBLIC_S3BUCKET}/${refundData?.product_meta?.product_image}`
                    : "/images/listings/product-draft-default.png"
                }
                alt={refundData?.product_meta?.product_name || "Product"}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Product Name */}
            <h3 className="text-lg font-semibold mb-4">
              <Link
                href={`/product-details/${refundData?.product_meta?.product_id}`}
                className="text-primary hover:underline"
              >
                {refundData?.product_meta?.product_name}
              </Link>
            </h3>

            {/* Status */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
              <span className="text-gray-500">Status</span>
              <Tag color={getStatusColor(refundData?.status)} className="m-0">
                {formatStatus(refundData?.status)}
              </Tag>
            </div>

            {/* Info Grid */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Request Date</span>
                <span className="font-medium">
                  {dateFormat(refundData?.created_at)} ({calculateTimeAgo(refundData?.created_at)})
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Refund Amount</span>
                <span className="font-medium">${refundData?.amount_requested || 0}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Item Downloaded</span>
                <span className="font-medium">
                  {refundData?.product_meta?.is_product_downloaded ? "Yes" : "No"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">License Downloaded</span>
                <span className="font-medium">
                  {refundData?.product_meta?.is_product_lic_downloaded ? "Yes" : "No"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Purchase Date</span>
                <span className="font-medium">
                  {dateFormat(refundData?.order_meta?.updated_at)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Support Period</span>
                <span className="font-medium">
                  {dateFormat(refundData?.order_meta?.updated_at)} — {dateAddSixMonth(refundData?.order_meta?.updated_at)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Purchase Code</span>
                <span className="font-medium font-mono text-sm">
                  {refundData?.order_meta?.order_id}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Request ID</span>
                <span className="font-medium font-mono text-sm">
                  {refundData?.id}
                </span>
              </div>
            </div>
          </Card>

          {/* Right Content - Request Details */}
          <div className="space-y-6">
            <Card>
              <h4 className="text-lg font-semibold mb-4">Refund Reason</h4>
              <ol className="list-decimal list-inside text-gray-600">
                <li>{refundData?.reason}</li>
              </ol>
            </Card>

            <Card>
              <h4 className="text-lg font-semibold mb-4">Customer's Request</h4>
              <p className="text-gray-600 whitespace-pre-wrap border-b pb-4 mb-4">
                {refundData?.description}
              </p>

              {/* Action Buttons */}
              {refundData?.status === "PENDING" && (
                <Button
                  type="primary"
                  danger
                  block
                  size="large"
                  onClick={handleCancel}
                >
                  Cancel Refund Request
                </Button>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
