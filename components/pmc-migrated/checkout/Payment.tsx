// Payment - migrated from PMC (matching original design exactly)
"use client";

import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Pencil, Info } from "lucide-react";
import { message } from "antd";
import BillingModal from "./BillingModal";
import PmcWallet from "./PmcWallet";
import PmcStripe from "./PmcStripe";
import { useCart } from "@/context/CartContext";

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
      <div className="mb-4 pb-3 border-2 border-bottom">
        <h2 className="fw-medium fz21 mb-0">Billing & Payment</h2>
        <p className="mb-0">
          Billing & Payment involves managing invoices, payment methods, and
          transaction processing for services.
        </p>
      </div>
      <div className="row g-4">
        <div className="col-lg-8">
          <div
            className="alert alert-warning d-flex align-items-center border-0"
            role="alert"
          >
            <Info size={26} className="flex-shrink-0 me-3" />
            <div>
              <div>
                This money will be kept in the PMC, paid to the service provider
                after the order is completed
              </div>
            </div>
          </div>
          <div className="checkout_form">
            <div>
              <h5 className="mb-3">Billing details</h5>
            </div>
            <div className="border p-3 p-xl-4 rounded-3">
              {!billingInfo?.id ? (
                <div className="col-auto mb-4">
                  <button
                    type="button"
                    className="btn-default px-3 py-2 rounded ud-btn"
                    onClick={() => {
                      setShowModal(true);
                      setIsUpdate(false);
                    }}
                  >
                    Add
                    <Pencil className="ms-2" size={16} />
                  </button>
                </div>
              ) : (
                <div className="row g-3 align-items-center">
                  <div className="col-auto">
                    <MapPin size={32} />
                  </div>
                  <div className="col">
                    <h5 className="mb-1">{billingInfo.country}</h5>
                    <div>{billingInfo.email}</div>
                    <div>{billingInfo.address_one}</div>
                  </div>
                  <div className="col-auto">
                    <button
                      type="button"
                      className="btn-default px-3 py-2 rounded ud-btn"
                      onClick={() => {
                        setShowModal(true);
                        setIsUpdate(true);
                      }}
                    >
                      Edit
                      <Pencil className="ms-2" size={16} />
                    </button>
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
        <div className="col-lg-4 ps-xl-5">
          <div className="bgc-gray-4 mb-3 p-4 rounded-4">
            <div className="p-sm-2 p-lg-0 p-xl-2">
              <h5 className="border-bottom pb-3 mb-4 fz19">Order summary</h5>
              <ul className="d-flex flex-column fs-sm gap-2 list-unstyled mb-0">
                <li className="d-flex justify-content-between">
                  Selected Item
                  <span className="text-dark-emphasis fw-medium">
                    {cartTotals.total_selected_items}
                  </span>
                </li>
                <li className="d-flex justify-content-between">
                  Total price
                  <span className="text-dark-emphasis fw-medium">
                    ${cartTotals.total_price?.toFixed(2)}
                  </span>
                </li>
                <li className="d-flex justify-content-between">
                  Extended support fee
                  <span className="text-dark-emphasis fw-medium">
                    ${cartTotals.extended_support_fee?.toFixed(2)}
                  </span>
                </li>
                <li className="d-flex justify-content-between">
                  Subtotal
                  <span className="text-dark-emphasis fw-medium">
                    ${cartTotals.subtotal_price?.toFixed(2)}
                  </span>
                </li>
                <li className="d-flex justify-content-between">
                  Discount
                  <span className="text-danger fw-medium">
                    ${cartTotals.total_discount}
                  </span>
                </li>
              </ul>
              <div className="border-top pt-4 mt-4">
                <div className="d-flex justify-content-between">
                  <span className="fs-sm">Total payable</span>
                  <span className="h5 fz18 mb-0">
                    ${cartTotals.total_payable?.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-thm d-block ud-btn w-100 mt-4"
                  onClick={handlePaymentMethodContinue}
                  disabled={(!isPaidByStripe && !isPaidByPmcWallet) || isSaving}
                >
                  {isSaving ? "Saving ..." : "Continue Payment"}
                  <ArrowRight size={16} className="ms-2" />
                </button>
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
