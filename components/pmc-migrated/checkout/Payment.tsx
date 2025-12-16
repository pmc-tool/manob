// Payment - migrated from PMC (matching original design exactly)
"use client";

import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Pencil, Info } from "lucide-react";
import { message } from "antd";
import BillingModal from "./BillingModal";
import PmcWallet from "./PmcWallet";
import PmcStripe from "./PmcStripe";
import { useCart } from "@/context/CartContext";
import { PmcButton, SecondaryButton } from "@/components/ui/pmc-button";

interface IBillingInfo {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  address_one: string;
  address_two: string;
  city: string;
  country: string;
  zip_code: string;
  notes: string;
}

interface PaymentProps {
  onClick: () => void;
  isSaving?: boolean;
}

export default function Payment({ onClick, isSaving }: PaymentProps) {
  const { cartTotals } = useCart();
  const [isUpdate, setIsUpdate] = useState(false);
  const [isPaidByPmcWallet, setIsPaidByPmcWallet] = useState(false);
  const [isPaidByStripe, setIsPaidByStripe] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [payAbleAmount, setPayableAmount] = useState<number>(0);
  const [actualBalance, setActualBalance] = useState<number>(0);
  const [billingInfo, setBillingInfo] = useState<IBillingInfo | null>(null);

  // Mock wallet info - will come from API in production
  const mockWalletBalance = 500;

  useEffect(() => {
    // Load billing info from localStorage
    const savedBilling = localStorage.getItem("pmc_billing_info");
    if (savedBilling) {
      setBillingInfo(JSON.parse(savedBilling));
    }
  }, []);

  useEffect(() => {
    const walletBalance = mockWalletBalance;
    const totalAmount = Number(cartTotals.total_payable);
    setPayableAmount(totalAmount);

    if (isPaidByPmcWallet) {
      setActualBalance(walletBalance - totalAmount);
      if (totalAmount > walletBalance) {
        setActualBalance(0);
      }
    } else {
      setActualBalance(walletBalance);
    }
  }, [cartTotals, isPaidByPmcWallet]);

  function paymentMethodSelected(type: string, value: boolean) {
    if (type === "PMCWALLET") {
      setIsPaidByPmcWallet(value);
      setIsPaidByStripe(false);
    } else if (type === "STRIPE") {
      setIsPaidByPmcWallet(false);
      setIsPaidByStripe(value);
    }
  }

  function handlePaymentMethodContinue() {
    if (!billingInfo?.id) {
      message.error("Please add billing info");
      return;
    }

    if (isPaidByPmcWallet) {
      onClick();
      return;
    }

    if (isPaidByStripe) {
      // In production, this would open Stripe payment modal
      message.info("Stripe payment integration - will connect to API");
      onClick();
      return;
    }

    message.error("Please select a payment method");
  }

  const handleBillingSubmit = (data: IBillingInfo) => {
    setBillingInfo(data);
    localStorage.setItem("pmc_billing_info", JSON.stringify(data));
    message.success("Billing info saved!");
  };

  return (
    <>
      <div className="mb-4 pb-3 border-b border-gray-200">
        <h2 className="font-medium text-xl mb-0">Billing & Payment</h2>
        <p className="mb-0 text-gray-600">
          Billing & Payment involves managing invoices, payment methods, and
          transaction processing for services.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <div
            className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded flex items-center"
            role="alert"
          >
            <Info size={26} className="shrink-0 mr-3 text-yellow-600" />
            <div>
              <div className="text-yellow-800">
                This money will be kept in the PMC, paid to the service provider
                after the order is completed
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div>
              <h5 className="mb-3">Billing details</h5>
            </div>
            <div className="border p-3 xl:p-4 rounded-lg">
              {!billingInfo?.id ? (
                <div className="mb-4">
                  <SecondaryButton
                    onClick={() => {
                      setShowModal(true);
                      setIsUpdate(false);
                    }}
                    icon={<Pencil size={16} />}
                  >
                    Add
                  </SecondaryButton>
                </div>
              ) : (
                <div className="flex gap-3 items-center">
                  <div className="flex-shrink-0">
                    <MapPin size={32} />
                  </div>
                  <div className="flex-1">
                    <h5 className="mb-1">{billingInfo.country}</h5>
                    <div>{billingInfo.email}</div>
                    <div>{billingInfo.address_one}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <SecondaryButton
                      onClick={() => {
                        setShowModal(true);
                        setIsUpdate(true);
                      }}
                      icon={<Pencil size={16} />}
                    >
                      Edit
                    </SecondaryButton>
                  </div>
                </div>
              )}
            </div>
            {!billingInfo?.id && (
              <p className="text-primary mt-2">
                Add your billing address to proceed with the payment.
              </p>
            )}

            <PmcWallet
              payAbleAmount={payAbleAmount}
              actualBalance={actualBalance}
              handlePaymentMethodChange={(type, value) =>
                paymentMethodSelected(type, value)
              }
            />

            <PmcStripe
              payAbleAmount={payAbleAmount}
              actualBalance={actualBalance}
              handlePaymentMethodChange={(type, value) =>
                paymentMethodSelected(type, value)
              }
            />
          </div>
        </div>
        <div className="lg:col-span-4 xl:pl-5">
          <div className="bg-gray-100 mb-3 p-4 rounded-mdxl">
            <div className="sm:p-2 lg:p-0 xl:p-2">
              <h5 className="border-b pb-3 mb-4 text-[19px] font-semibold">Order summary</h5>
              <ul className="flex flex-col text-sm gap-2 list-none m-0 p-0">
                <li className="flex justify-between">
                  Selected Item
                  <span className="text-gray-900 font-medium">
                    {cartTotals.total_selected_items}
                  </span>
                </li>
                <li className="flex justify-between">
                  Total price
                  <span className="text-gray-900 font-medium">
                    ${cartTotals.total_price?.toFixed(2)}
                  </span>
                </li>
                <li className="flex justify-between">
                  Extended support fee
                  <span className="text-gray-900 font-medium">
                    ${cartTotals.extended_support_fee?.toFixed(2)}
                  </span>
                </li>
                <li className="flex justify-between">
                  Subtotal
                  <span className="text-gray-900 font-medium">
                    ${cartTotals.subtotal_price?.toFixed(2)}
                  </span>
                </li>
                <li className="flex justify-between">
                  Discount
                  <span className="text-red-600 font-medium">
                    ${cartTotals.total_discount}
                  </span>
                </li>
              </ul>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total payable</span>
                  <span className="text-lg font-semibold">
                    ${cartTotals.total_payable?.toFixed(2)}
                  </span>
                </div>
                <PmcButton
                  variant="primary"
                  fullWidth
                  className="mt-4"
                  onClick={handlePaymentMethodContinue}
                  disabled={(!isPaidByStripe && !isPaidByPmcWallet) || isSaving}
                  icon={<ArrowRight size={16} />}
                >
                  {isSaving ? "Saving ..." : "Continue Payment"}
                </PmcButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BillingModal
        isModalOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleBillingSubmit}
        isUpdate={isUpdate}
        initialData={billingInfo}
      />
    </>
  );
}
