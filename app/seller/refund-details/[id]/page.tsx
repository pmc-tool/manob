"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, Button, Modal, Input, Tag, Skeleton, Tooltip } from "antd";
import { X, Info, ArrowLeft, Package, Calendar, Download, Key, Clock, Hash, DollarSign } from "lucide-react";
import toast from "react-hot-toast";
import {
  useAcceptRequestMutation,
  useDeclineRequestMutation,
  useGetRefundDetailsQuery,
} from "@/state/services/seller-service/refund.service";
import {
  calculateTimeAgo,
  dateAddSixMonth,
  dateFormat,
} from "@/utils/dateFormat";

const { TextArea } = Input;

interface RefundData {
  id: string;
  reason: string;
  description: string;
  status: string;
  amount_requested: number;
  created_at: string;
  product_meta: {
    product_id: string;
    product_name: string;
    product_image: string;
    is_product_downloaded: boolean;
    is_product_lic_downloaded: boolean;
  };
  order_meta: {
    order_id: string;
    selling_price: number;
    updated_at: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "warning";
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "error";
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

export default function SellerRefundDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [declineReason, setDeclineReason] = useState("");
  const [declineError, setDeclineError] = useState("");
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [amountError, setAmountError] = useState("");
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isDeclineFormVisible, setIsDeclineFormVisible] = useState(false);

  const { data: refundData, isLoading } = useGetRefundDetailsQuery(id) as { data: RefundData; isLoading: boolean };
  const [acceptRequest, { data: acceptData, isLoading: isAccepting }] = useAcceptRequestMutation();
  const [declineRequest, { data: declineData, isLoading: isDeclining }] = useDeclineRequestMutation();

  // Set initial refund amount
  useEffect(() => {
    if (refundData?.amount_requested) {
      setRefundAmount(refundData.amount_requested);
    }
  }, [refundData]);

  // Handle accept response
  useEffect(() => {
    if (acceptData?.statusCode === 201) {
      toast.success("Refund request accepted successfully");
      router.push("/seller/refund-list");
    } else if (acceptData?.statusCode && acceptData?.statusCode !== 201) {
      toast.error(acceptData?.message || "Failed to accept the request");
    }
  }, [acceptData, router]);

  // Handle decline response
  useEffect(() => {
    if (declineData?.statusCode === 201) {
      toast.success("Refund request declined");
      router.push("/seller/refund-list");
    } else if (declineData?.statusCode && declineData?.statusCode !== 201) {
      toast.error(declineData?.message || "Failed to decline the request");
    }
  }, [declineData, router]);

  const handleAcceptSave = async () => {
    if (refundAmount <= 0) {
      setAmountError("Refund amount is required");
      return;
    }
    if (refundAmount > (refundData?.order_meta?.selling_price || 0)) {
      setAmountError("Refund amount cannot exceed the selling price");
      return;
    }
    setAmountError("");
    await acceptRequest({
      refund_amount: refundAmount,
      id: id,
    });
  };

  const handleDeclineSubmit = async () => {
    if (!declineReason) {
      setDeclineError("Please provide a reason");
      return;
    }
    if (declineReason.length < 10) {
      setDeclineError("Reason must be at least 10 characters");
      return;
    }
    if (declineReason.length > 5000) {
      setDeclineError("Reason cannot exceed 5000 characters");
      return;
    }
    setDeclineError("");
    await declineRequest({
      reason: declineReason,
      id: id,
    });
  };

  const isPending = refundData?.status === "PENDING";
  const productImage = refundData?.product_meta?.product_image
    ? `${process.env.NEXT_PUBLIC_S3BUCKET}/${refundData.product_meta.product_image}`
    : "/images/placeholder-product.jpg";

  if (isLoading) {
    return (
      <section className="p-6">
        <div className="max-w-6xl mx-auto">
          <Skeleton active paragraph={{ rows: 12 }} />
        </div>
      </section>
    );
  }

  return (
    <section className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/seller/refund-list"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Refund List
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Sidebar - Product & Request Info */}
          <div className="lg:col-span-2">
            <Card>
              {/* Product Info */}
              <div className="flex gap-4 pb-4 border-b border-gray-100 mb-4">
                <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={productImage}
                    alt={refundData?.product_meta?.product_name || "Product"}
                    width={96}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product-details/${refundData?.product_meta?.product_id}`}
                    className="font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2"
                  >
                    {refundData?.product_meta?.product_name}
                  </Link>
                </div>
              </div>

              {/* Request Details */}
              <div className="space-y-4">
                <DetailRow
                  icon={<Calendar size={16} />}
                  label="Request sent"
                  value={`${dateFormat(refundData?.created_at)} (${calculateTimeAgo(refundData?.created_at)})`}
                />
                <DetailRow
                  icon={<Package size={16} />}
                  label="Main refund reason"
                  value={refundData?.reason}
                />
                <DetailRow
                  icon={<Download size={16} />}
                  label="Item downloaded?"
                  value={refundData?.product_meta?.is_product_downloaded ? "Yes" : "No"}
                />
                <DetailRow
                  icon={<Key size={16} />}
                  label="Purchase code downloaded?"
                  value={refundData?.product_meta?.is_product_lic_downloaded ? "Yes" : "No"}
                />
                <DetailRow
                  icon={<Clock size={16} />}
                  label="Support dates"
                  value={`${dateFormat(refundData?.order_meta?.updated_at)} — ${dateAddSixMonth(refundData?.order_meta?.updated_at)}`}
                />
                <DetailRow
                  icon={<Calendar size={16} />}
                  label="Purchase date"
                  value={dateFormat(refundData?.order_meta?.updated_at)}
                />
                <DetailRow
                  icon={<Hash size={16} />}
                  label="Order ID"
                  value={refundData?.order_meta?.order_id}
                  mono
                />
                <DetailRow
                  icon={<Hash size={16} />}
                  label="Refund request ID"
                  value={refundData?.id}
                  mono
                />

                {/* Status */}
                <div className="flex items-center justify-between py-3 border-t border-gray-100">
                  <span className="text-gray-600 font-medium">Status</span>
                  <Tag color={getStatusColor(refundData?.status)}>
                    {formatStatus(refundData?.status)}
                  </Tag>
                </div>

                {/* Amount */}
                <div className="flex items-center justify-between py-3 border-t border-gray-100">
                  <span className="text-gray-600 font-medium flex items-center gap-2">
                    Requested Amount
                    <Tooltip title="The price includes sales taxes. It does not include handling fees.">
                      <Info size={14} className="text-gray-400 cursor-help" />
                    </Tooltip>
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ${refundData?.amount_requested || 0}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Content - Customer Request */}
          <div className="lg:col-span-3">
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Refund Reason</h2>
              <ol className="list-decimal list-inside mb-6 text-gray-700">
                <li>{refundData?.reason}</li>
              </ol>

              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer's Request</h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {refundData?.description || "No additional details provided."}
                </p>
              </div>

              {/* Decline Form */}
              {isDeclineFormVisible && (
                <div className="border border-orange-200 rounded-lg p-4 mb-6 bg-orange-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      Explain why to the customer
                    </h3>
                    <Button
                      type="text"
                      icon={<X size={18} />}
                      onClick={() => {
                        setIsDeclineFormVisible(false);
                        setDeclineReason("");
                        setDeclineError("");
                      }}
                    />
                  </div>
                  <TextArea
                    rows={6}
                    value={declineReason}
                    onChange={(e) => {
                      setDeclineReason(e.target.value);
                      setDeclineError("");
                    }}
                    placeholder="Please provide a detailed explanation for declining this refund request..."
                    className="mb-2"
                  />
                  {declineError && (
                    <p className="text-red-500 text-sm mb-3">{declineError}</p>
                  )}
                  <Button
                    type="primary"
                    danger
                    block
                    size="large"
                    onClick={handleDeclineSubmit}
                    loading={isDeclining}
                  >
                    Decline Refund
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              {!isDeclineFormVisible && isPending && (
                <div className="flex gap-3">
                  <Button
                    size="large"
                    className="flex-1"
                    onClick={() => setIsDeclineFormVisible(true)}
                  >
                    Decline Refund
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    className="flex-1"
                    onClick={() => setIsAcceptModalOpen(true)}
                  >
                    Give Refund
                  </Button>
                </div>
              )}

              {/* Status Message for non-pending */}
              {!isPending && (
                <div className={`p-4 rounded-lg ${
                  refundData?.status === "APPROVED"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}>
                  <p className="font-medium">
                    {refundData?.status === "APPROVED"
                      ? "This refund request has been approved."
                      : "This refund request has been declined."}
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Accept Refund Modal */}
      <Modal
        open={isAcceptModalOpen}
        onCancel={() => {
          setIsAcceptModalOpen(false);
          setAmountError("");
        }}
        title="Confirm Refund Amount"
        footer={
          <div className="flex gap-2 justify-end">
            <Button onClick={() => setIsAcceptModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleAcceptSave}
              loading={isAccepting}
            >
              Confirm Refund
            </Button>
          </div>
        }
        centered
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 bg-gray-50 rounded-lg px-4">
            <span className="text-gray-600">Product Price</span>
            <span className="font-semibold">${refundData?.order_meta?.selling_price || 0}</span>
          </div>

          <div className="flex items-center justify-between py-3 bg-gray-50 rounded-lg px-4">
            <span className="text-gray-600">Requested Amount</span>
            <span className="font-semibold">${refundData?.amount_requested || 0}</span>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Refund Amount <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              size="large"
              prefix={<DollarSign size={16} className="text-gray-400" />}
              value={refundAmount}
              onChange={(e) => {
                setRefundAmount(Number(e.target.value));
                setAmountError("");
              }}
              status={amountError ? "error" : undefined}
            />
            {amountError && (
              <p className="text-red-500 text-sm mt-1">{amountError}</p>
            )}
            <p className="text-gray-500 text-sm mt-2">
              Enter the amount to refund. Cannot exceed the product price.
            </p>
          </div>
        </div>
      </Modal>
    </section>
  );
}

// Helper component for detail rows
function DetailRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100">
      <div className="flex items-center gap-2 text-gray-600 flex-shrink-0">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <span className={`text-gray-900 text-right ${mono ? "font-mono text-sm" : ""}`}>
        {value || "-"}
      </span>
    </div>
  );
}
