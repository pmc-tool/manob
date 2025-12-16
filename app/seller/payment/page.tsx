"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Modal, Skeleton, Tooltip } from "antd";
import { Plus, Eye, Trash2, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  useDeleteMethodMutation,
  useGetMyMethodsQuery,
  useUpdateMethodMutation,
} from "@/state/services/seller-service/finance.service";

interface AccountDetails {
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  bank_branch?: string;
  swift_code?: string;
  routing_number?: string;
  currency?: string;
  country?: string;
}

interface PaymentMethod {
  id: string;
  is_default: boolean;
  account_details: AccountDetails;
  method_type: string;
  account_type: string;
}

export default function SellerPaymentPage() {
  const [showModal, setShowModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const { data: paymentMethods, isLoading } = useGetMyMethodsQuery();
  const [deleteMethod, { isLoading: isDeleting }] = useDeleteMethodMutation();
  const [setDefaultMethod, { isLoading: isUpdating }] = useUpdateMethodMutation();

  const handleOpenModal = (id: string) => {
    const method = paymentMethods?.data?.find((m: PaymentMethod) => m.id === id);
    setSelectedMethod(method || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMethod(null);
  };

  const handleSetDefault = async () => {
    if (!selectedMethod) return;
    await setDefaultMethod({ id: selectedMethod.id, is_default: true });
    toast.success("Set as default successfully!");
    setShowModal(false);
  };

  const handleDeleteClick = (id: string) => {
    const method = paymentMethods?.data?.find((m: PaymentMethod) => m.id === id);
    setSelectedMethod(method || null);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedMethod) return;
    const result = await deleteMethod(selectedMethod.id);
    if ((result as { data?: { statusCode: number; message?: string } })?.data?.statusCode === 200) {
      toast.success("Deleted successfully!");
    } else {
      toast.error((result as { data?: { message?: string } })?.data?.message || "Failed to delete.");
    }
    setDeleteModalOpen(false);
    setSelectedMethod(null);
  };

  if (isLoading) {
    return (
      <section className="p-6">
        <div className="max-w-4xl mx-auto">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </section>
    );
  }

  const methods = paymentMethods?.data || [];

  return (
    <section className="pt-6 px-4">
      <div className="max-w-4xl mx-auto">
        {methods.length > 0 ? (
          <>
            {/* Header */}
            <div className="flex flex-wrap items-end gap-2 mb-4">
              <div className="flex-1">
                <h1 className="text-xl font-medium text-gray-900 mb-0">
                  Payout Methods
                </h1>
              </div>
              <div>
                <Link href="/seller/add-payment">
                  <Button icon={<Plus size={16} />} className="flex items-center gap-2">
                    Add Payout Method
                  </Button>
                </Link>
              </div>
            </div>

            {/* Payment Cards */}
            {methods.map((method: PaymentMethod) => (
              <div
                key={method.id}
                className="relative border border-gray-200 rounded-xl p-4 sm:p-5 mb-3 bg-gradient-to-br from-white to-slate-50"
              >
                {/* Default Badge */}
                {method.is_default && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                    Default
                  </span>
                )}

                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  {/* Left: Icon + Details */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <Building2 size={40} className="text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-600 mb-1">Bank Transfer</div>
                      <h6 className="text-base font-semibold text-gray-900 mb-0 truncate">
                        {method.account_details?.account_name || "-"}
                      </h6>
                      <div className="text-sm text-gray-500 truncate">
                        {method.account_details?.bank_name || "-"}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-4">
                    <Tooltip title="View">
                      <button
                        type="button"
                        className="border-0 p-0 bg-transparent cursor-pointer"
                        onClick={() => handleOpenModal(method.id)}
                      >
                        <Eye size={19} className="text-green-600" />
                      </button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <button
                        type="button"
                        className="border-0 p-0 bg-transparent cursor-pointer"
                        onClick={() => handleDeleteClick(method.id)}
                      >
                        <Trash2 size={19} className="text-red-500" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-[150px] h-[150px] mx-auto mb-4 flex items-center justify-center">
              <Building2 size={80} className="text-gray-300" />
            </div>
            <div className="mt-3">
              <div className="font-semibold text-lg text-gray-900">
                Payment Methods Not Found
              </div>
              <div className="text-sm text-gray-500 mt-1">
                We couldn&apos;t retrieve any available payment methods at the moment. Please
                <br className="hidden sm:block" /> try again later or contact support for assistance.
              </div>
              <Link href="/seller/add-payment">
                <Button type="primary" className="mt-4 rounded-full">
                  Add Payout Method
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      <Modal
        open={showModal}
        onCancel={handleCloseModal}
        title="Account Details"
        footer={
          selectedMethod?.is_default === false ? (
            <div className="flex gap-2 justify-end">
              <Button onClick={handleCloseModal}>Close</Button>
              <Button type="primary" onClick={handleSetDefault} loading={isUpdating}>
                Set as Default Payment
              </Button>
            </div>
          ) : (
            <Button onClick={handleCloseModal}>Close</Button>
          )
        }
        centered
      >
        {selectedMethod && (
          <div>
            {[
              { label: "Account Name", value: selectedMethod.account_details?.account_name },
              { label: "Account No", value: selectedMethod.account_details?.account_number },
              { label: "Bank Name", value: selectedMethod.account_details?.bank_name },
              { label: "Bank Branch Name", value: selectedMethod.account_details?.bank_branch },
              { label: "Bank Swift Code", value: selectedMethod.account_details?.swift_code },
            ].map(({ label, value }, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-200 mb-2 pb-2"
              >
                <span className="text-primary opacity-75">{label}</span>
                <span className="font-medium text-gray-900">{value || "-"}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        title="Are you sure?"
        footer={
          <div className="flex gap-2 justify-end">
            <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button danger type="primary" onClick={confirmDelete} loading={isDeleting}>
              Yes, delete it!
            </Button>
          </div>
        }
        centered
      >
        <p className="text-gray-600">You won&apos;t be able to revert this!</p>
      </Modal>
    </section>
  );
}
