"use client";

import { useEffect, useState } from "react";
import { Card, Button, Modal } from "antd";
import { MapPin, Pencil, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import BillingModal from "@/components/pmc-migrated/checkout/BillingModal";
import PmcWallet from "@/components/pmc-migrated/checkout/PmcWallet";
import PmcStripe from "@/components/pmc-migrated/checkout/PmcStripe";
import StripePaymentMethod from "@/components/pmc-migrated/checkout/StripePaymentMethod";
import { useAppSelector, useAppDispatch } from "@/state/hooks";
import {
  useCompleteSubscriptionMutation,
  useGetWalletInfoQuery,
  useGetBillingAddressQuery,
} from "@/state/services/checkout-service/checkout.service";
import { setBillingInfo, setOrderType, resetOrderType } from "@/state/slices/checkout.slice";
import { dateFormat, getExpiryDate } from "@/utils/dateFormat";
import { validateBillingAddress } from "@/utils/validateBillingAddress";
import useStripePayment from "@/hooks/useStripePayment";

interface PackageData {
  id: string;
  connect_count: number;
  price: number;
  tax: number;
  discount: number;
  total_payable: number;
  validity: number;
}

interface PaymentProps {
  packageData: PackageData;
  onNext: (data: PackageData) => void;
  onBack: () => void;
}

export default function Payment({ packageData, onNext, onBack }: PaymentProps) {
  const dispatch = useAppDispatch();
  const date = new Date();
  const [isUpdate, setIsUpdate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [payAbleAmount, setPayableAmount] = useState<number>(0);
  const [actualBalance, setActualBalance] = useState<number>(0);
  const [remainingBalance, setRemainingBalance] = useState<number>(0);
  const [isPaidByPmcWallet, setIsPaidByPmcWallet] = useState(false);
  const [isPaidByStripe, setIsPaidByStripe] = useState(false);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { data: myWalletInfo } = useGetWalletInfoQuery();
  const { data: billingData } = useGetBillingAddressQuery();
  const { getStripe } = useStripePayment();
  const [completeCheckout, { data: checkOutData }] = useCompleteSubscriptionMutation();

  const billingInfo = useAppSelector((state) => state.checkoutStore.billingInfo) as {
    id?: string;
    country?: string;
    email?: string;
    address_one?: string;
  };

  // Set billing info from API on mount
  useEffect(() => {
    if (billingData?.data) {
      dispatch(setBillingInfo(billingData.data as object | null));
    }
  }, [billingData, dispatch]);

  // Set order type on mount
  useEffect(() => {
    dispatch(setOrderType("CONNECT_ORDER"));
    return () => {
      dispatch(resetOrderType());
    };
  }, [dispatch]);

  // Handle checkout response
  useEffect(() => {
    if (checkOutData?.statusCode === 201) {
      setIsSaving(false);
      toast.success("Payment successful!");
      onNext(checkOutData?.data);
    } else if (checkOutData?.statusCode && checkOutData?.statusCode !== 201) {
      toast.error(checkOutData?.message || "Payment failed");
      setIsSaving(false);
    }
  }, [checkOutData, onNext]);

  // Calculate wallet balance and payable amount
  useEffect(() => {
    const discount = 0;
    const amountAfterDiscount = +packageData?.total_payable - discount;
    const walletBalance = Number(myWalletInfo?.data?.usable_balance || 0);
    setPayableAmount(amountAfterDiscount);

    if (isPaidByPmcWallet) {
      setActualBalance(walletBalance - amountAfterDiscount);

      if (amountAfterDiscount > walletBalance) {
        setRemainingBalance(amountAfterDiscount - walletBalance);
        setActualBalance(0);
      } else {
        setRemainingBalance(0);
      }
    } else {
      setRemainingBalance(amountAfterDiscount);
      setActualBalance(walletBalance);
    }
  }, [myWalletInfo, isPaidByPmcWallet, packageData?.total_payable]);

  const handleBillingPromptClose = () => {
    setShowModal(false);
  };

  const handleBillingPromptSubmit = (data: object) => {
    dispatch(setBillingInfo(data as object | null));
    setShowModal(false);
  };

  const makePayment = async () => {
    try {
      const validateAddress = validateBillingAddress(billingInfo);

      if (!validateAddress) {
        toast.error("Invalid billing address!");
        return;
      }
      setIsSaving(true);
      const insertData = {
        package_id: packageData?.id,
        billing_address: { ...billingInfo },
        payment_method: isPaidByPmcWallet ? "PMC_WALLET" : "CARD",
      };
      await completeCheckout(insertData as never);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Please try again";
      toast.error(errorMessage);
      setIsSaving(false);
    }
  };

  function paymentMethodSelected(type: string, value: boolean) {
    if (type === "PMCWALLET") {
      setIsPaidByPmcWallet(value);
      setIsPaidByStripe(false);
    } else if (type === "STRIPE") {
      setIsPaidByPmcWallet(false);
      setIsPaidByStripe(value);
    }
  }

  async function handlePaymentMethodContinue() {
    if (isPaidByPmcWallet) {
      makePayment();
    } else if (isPaidByStripe) {
      const validateAddress = validateBillingAddress(billingInfo);
      if (!validateAddress) {
        toast.error("Invalid billing address!");
        return;
      }
      setClientSecret("");
      const res = await getStripe("CONNECT_ORDER", {
        connect_id: packageData?.id,
      });
      if (res?.status === true) {
        setClientSecret(res.clientSecret);
        setIsStripeModalOpen(true);
      }
    }
  }

  const isPaymentDisabled = isPaidByStripe
    ? false
    : isPaidByPmcWallet && remainingBalance === 0
    ? false
    : isSaving
    ? true
    : true;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Payment Options */}
        <div className="lg:col-span-2">
          <Card className="mb-4">
            <h5 className="mb-3 font-semibold text-lg">Billing details</h5>
            {!billingInfo?.id ? (
              <div className="mb-4">
                <Button
                  type="default"
                  onClick={() => {
                    setShowModal(true);
                    setIsUpdate(false);
                  }}
                  icon={<Pencil size={16} />}
                >
                  Add Billing Address
                </Button>
                <p className="text-primary mt-2 text-sm">
                  Add your billing address to proceed with the payment.
                </p>
              </div>
            ) : (
              <div className="border p-4 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  <MapPin size={32} className="text-gray-500 flex-shrink-0" />
                  <div className="flex-1">
                    <h5 className="mb-1 font-semibold">{billingInfo?.country}</h5>
                    <div className="text-gray-600 text-sm">{billingInfo?.email}</div>
                    <div className="text-gray-600 text-sm">{billingInfo?.address_one}</div>
                  </div>
                  <Button
                    type="default"
                    onClick={() => {
                      setShowModal(true);
                      setIsUpdate(true);
                    }}
                    icon={<Pencil size={16} />}
                  >
                    Edit
                  </Button>
                </div>
              </div>
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
          </Card>

          <Button onClick={onBack} className="mr-2">
            Back
          </Button>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-50">
            <div className="border-b-2 border-gray-200 mb-3 pb-2">
              <h2 className="mb-0 font-bold text-2xl">
                ${packageData?.total_payable || 0}
              </h2>
              <div className="text-gray-500">Connect Price</div>
            </div>

            <div className="mb-4">
              <h5 className="border-b border-gray-200 pb-3 mb-3 font-semibold">
                Connect Details
              </h5>
              <ul className="flex flex-col gap-2 text-sm">
                <li className="flex justify-between">
                  <span>Connects</span>
                  <span className="text-gray-900 font-medium">
                    {packageData?.connect_count || 0}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Start Date</span>
                  <span className="text-gray-900 font-medium">
                    {dateFormat(date.toString())}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>End Date</span>
                  <span className="text-gray-900 font-medium">
                    {getExpiryDate(date, packageData?.validity || 1)}
                  </span>
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <h5 className="border-b border-gray-200 pb-3 mb-3 font-semibold">
                Order summary
              </h5>
              <ul className="flex flex-col gap-2 text-sm">
                <li className="flex justify-between">
                  <span>Sub Total</span>
                  <span className="text-gray-900 font-medium">
                    ${packageData?.price || 0}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Tax</span>
                  <span className="text-gray-900 font-medium">
                    ${packageData?.tax || 0}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-primary font-medium">
                    -${packageData?.discount || 0}
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between mb-4">
                <span className="text-sm">Total Price</span>
                <span className="font-bold text-lg">
                  ${packageData?.total_payable || 0}
                </span>
              </div>
              <Button
                type="primary"
                size="large"
                className="w-full"
                disabled={isPaymentDisabled}
                loading={isSaving}
                onClick={handlePaymentMethodContinue}
              >
                {isSaving ? "Processing..." : "Make Payment"}
                {!isSaving && <ArrowRight size={16} className="ml-2" />}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Billing Modal */}
      <BillingModal
        isModalOpen={showModal}
        onClose={handleBillingPromptClose}
        onSubmit={handleBillingPromptSubmit}
        isUpdate={isUpdate}
        initialData={billingInfo?.id ? billingInfo as never : null}
      />

      {/* Stripe Payment Modal */}
      <Modal
        open={isStripeModalOpen && clientSecret !== ""}
        onCancel={() => setIsStripeModalOpen(false)}
        footer={null}
        title="Complete Payment"
        centered
      >
        <StripePaymentMethod
          remainingBalance={remainingBalance}
          onCloseModal={() => setIsStripeModalOpen(false)}
          clientSecret={clientSecret}
        />
      </Modal>
    </>
  );
}
