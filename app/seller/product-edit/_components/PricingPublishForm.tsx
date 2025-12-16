"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Checkbox, Card, Modal, InputNumber, Tooltip, Result } from "antd";
import { Info, Calculator, CheckCircle, PartyPopper } from "lucide-react";
import toast from "react-hot-toast";

interface PricingPublishFormProps {
  productId: string;
  categoryData: any;
  onBack: () => void;
}

const INPUT_PRICE_MAX = 10000;

// Mock product info for development
const mockProductInfo = {
  regular_lic_price: 29,
  extended_lic_price: 199,
  buyer_fee: 5,
  extended_buyer_fee: 50,
  msg_for_reviewer: "",
};

export default function PricingPublishForm({
  productId,
  categoryData,
  onBack,
}: PricingPublishFormProps) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [regularPrice, setRegularPrice] = useState<number>(0);
  const [extendedPrice, setExtendedPrice] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [earningModalOpen, setEarningModalOpen] = useState(false);
  const [earningModalType, setEarningModalType] = useState<"regular" | "extended">("regular");
  const [calculatorInput, setCalculatorInput] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // Use mock data for development
  const productInfo = mockProductInfo;

  // Get buyer fees from category or product info
  const regularBuyerFee = productInfo?.buyer_fee || categoryData?.buyer_fee || 0;
  const extendedBuyerFee = productInfo?.extended_buyer_fee || categoryData?.extended_buyer_fee || 0;

  // Calculate purchase prices
  const regularPurchasePrice = regularPrice + regularBuyerFee;
  const extendedPurchasePrice = extendedPrice + extendedBuyerFee;

  // Initialize form with existing data
  useEffect(() => {
    if (productInfo) {
      const regPrice = Number(productInfo.regular_lic_price) || 0;
      const extPrice = Number(productInfo.extended_lic_price) || 0;

      form.setFieldsValue({
        regular_lic_price: regPrice,
        extended_lic_price: extPrice,
        msg_for_reviewer: productInfo.msg_for_reviewer || "",
      });

      setRegularPrice(regPrice);
      setExtendedPrice(extPrice);
    }
  }, [productInfo, form]);

  // Calculate earnings
  const calculateEarnings = (purchasePrice: number, buyerFee: number) => {
    const supportFee = 10; // 10% default
    const valueAfterBuyerFee = purchasePrice - buyerFee;
    const supportFeeValue = (valueAfterBuyerFee * supportFee) / 100;
    const productOriginalPrice = valueAfterBuyerFee - supportFeeValue;
    const totalFees = buyerFee + (supportFeeValue * 35) / 100 + (productOriginalPrice * 35) / 100;
    const sellerEarnings = purchasePrice - totalFees;

    return {
      sellerEarnings: sellerEarnings > 0 ? sellerEarnings.toFixed(2) : "0.00",
      totalFees: totalFees.toFixed(2),
    };
  };

  const openEarningModal = (type: "regular" | "extended") => {
    setEarningModalType(type);
    setCalculatorInput(type === "regular" ? regularPurchasePrice : extendedPurchasePrice);
    setEarningModalOpen(true);
  };

  const onFinish = async (values: any) => {
    if (!values.confirmation) {
      toast.error("Please confirm asset ownership");
      return;
    }

    setIsLoading(true);

    const payload = {
      productId,
      regular_lic_price: Number(values.regular_lic_price),
      extended_lic_price: Number(values.extended_lic_price),
      msg_for_reviewer: values.msg_for_reviewer,
    };

    console.log("Mock submit payload:", payload);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    toast.success("Product submitted for review!");
    setShowSuccess(true);
  };

  // Success screen
  if (showSuccess) {
    return (
      <Result
        icon={<PartyPopper size={64} className="text-green-500" />}
        status="success"
        title="Product Submitted Successfully!"
        subTitle="Your product has been submitted for review. You'll be notified once it's approved."
        extra={[
          <Button type="primary" key="products" onClick={() => router.push("/seller/product-list")}>
            View My Products
          </Button>,
          <Button key="new" onClick={() => router.push("/seller/product-add")}>
            Upload Another Product
          </Button>,
        ]}
      />
    );
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-xl font-semibold text-gray-900">Set Your Price (US$)</h3>
          <p className="text-sm text-gray-500 mt-1">
            Set the price for your items independently. The item price includes your author fee.
          </p>
        </div>

        {/* Regular License */}
        <Card className="bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="md:w-1/3">
              <h4 className="font-semibold text-gray-900">Regular License</h4>
              <p className="text-xs text-gray-500 italic mt-1">
                Recommended purchase price $44 - $59
              </p>
            </div>

            <div className="md:w-2/3">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Item Price
                    <Tooltip title="The item price includes your author fee">
                      <Info size={14} className="inline ml-1 text-gray-400" />
                    </Tooltip>
                  </label>
                  <Form.Item
                    name="regular_lic_price"
                    rules={[
                      { required: true, message: "Required" },
                      {
                        type: "number",
                        max: INPUT_PRICE_MAX,
                        message: `Max $${INPUT_PRICE_MAX}`,
                      },
                    ]}
                    className="mb-0"
                  >
                    <InputNumber
                      prefix="$"
                      min={1}
                      max={INPUT_PRICE_MAX}
                      className="w-full"
                      onChange={(value) => setRegularPrice(Number(value) || 0)}
                    />
                  </Form.Item>
                </div>

                <div className="text-2xl font-light text-gray-400">+</div>

                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Fee</label>
                  <div className="text-xl font-semibold">${regularBuyerFee}</div>
                </div>

                <div className="text-2xl font-light text-gray-400">=</div>

                <div className="text-center">
                  <label className="block text-sm font-medium text-primary mb-1">
                    Purchase Price
                  </label>
                  <div className="text-xl font-semibold text-primary">${regularPurchasePrice}</div>
                </div>
              </div>

              <button
                type="button"
                className="text-sm text-primary hover:underline mt-2"
                onClick={() => openEarningModal("regular")}
              >
                <Calculator size={14} className="inline mr-1" />
                How much of this will I earn?
              </button>
            </div>
          </div>
        </Card>

        {/* Extended License */}
        <Card className="bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="md:w-1/3">
              <h4 className="font-semibold text-gray-900">Extended License</h4>
              <p className="text-xs text-gray-500 italic mt-1">
                Recommended purchase price $2,200 - $2,950
              </p>
            </div>

            <div className="md:w-2/3">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Item Price
                    <Tooltip title="The item price includes your author fee">
                      <Info size={14} className="inline ml-1 text-gray-400" />
                    </Tooltip>
                  </label>
                  <Form.Item
                    name="extended_lic_price"
                    rules={[
                      { required: true, message: "Required" },
                      {
                        type: "number",
                        max: INPUT_PRICE_MAX,
                        message: `Max $${INPUT_PRICE_MAX}`,
                      },
                    ]}
                    className="mb-0"
                  >
                    <InputNumber
                      prefix="$"
                      min={1}
                      max={INPUT_PRICE_MAX}
                      className="w-full"
                      onChange={(value) => setExtendedPrice(Number(value) || 0)}
                    />
                  </Form.Item>
                </div>

                <div className="text-2xl font-light text-gray-400">+</div>

                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Fee</label>
                  <div className="text-xl font-semibold">${extendedBuyerFee}</div>
                </div>

                <div className="text-2xl font-light text-gray-400">=</div>

                <div className="text-center">
                  <label className="block text-sm font-medium text-primary mb-1">
                    Purchase Price
                  </label>
                  <div className="text-xl font-semibold text-primary">${extendedPurchasePrice}</div>
                </div>
              </div>

              <button
                type="button"
                className="text-sm text-primary hover:underline mt-2"
                onClick={() => openEarningModal("extended")}
              >
                <Calculator size={14} className="inline mr-1" />
                How much of this will I earn?
              </button>
            </div>
          </div>
        </Card>

        {/* Message for Reviewer */}
        <Form.Item
          name="msg_for_reviewer"
          label={
            <span className="font-medium">
              Message for Reviewer <span className="text-red-500">*</span>
            </span>
          }
          rules={[{ required: true, message: "Please add a message for the reviewer" }]}
          extra="Explain any special features, usage instructions, or notes for the reviewer"
        >
          <Input.TextArea
            rows={5}
            placeholder="Add any notes or instructions for the reviewer..."
            showCount
            maxLength={1000}
          />
        </Form.Item>

        {/* Confirmation Checkbox */}
        <Form.Item
          name="confirmation"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject("Please confirm asset ownership"),
            },
          ]}
        >
          <Checkbox>
            <span className="text-sm text-gray-600">
              Any images, sounds, video, code, flash, or other assets that are not my own work,
              have been appropriately licensed for use in the file preview or main download. Other
              than these items, this work is entirely my own and I have full rights to sell it on
              PackMyCode.
            </span>
          </Checkbox>
        </Form.Item>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <Button size="large" onClick={onBack}>
            Previous
          </Button>
          <Button type="primary" htmlType="submit" size="large" loading={isLoading}>
            <CheckCircle size={18} className="mr-2" />
            Submit Product for Review
          </Button>
        </div>
      </div>

      {/* Earning Calculator Modal */}
      <Modal
        title="Earning Calculator"
        open={earningModalOpen}
        onCancel={() => setEarningModalOpen(false)}
        footer={null}
        centered
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <span className="text-gray-600">Purchase price $</span>
            <InputNumber
              value={calculatorInput}
              onChange={(value) => setCalculatorInput(Number(value) || 0)}
              min={0}
              className="w-24"
            />
            <span className="text-gray-600">You'll earn</span>
            <span className="text-xl font-semibold text-primary">
              $
              {
                calculateEarnings(
                  calculatorInput,
                  earningModalType === "regular" ? regularBuyerFee : extendedBuyerFee
                ).sellerEarnings
              }
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 text-center">Fees for this item</h4>

            <div className="border-b border-gray-100 pb-3">
              <div className="font-medium">
                Buyer fee $
                {earningModalType === "regular" ? regularBuyerFee : extendedBuyerFee}
              </div>
              <p className="text-sm text-gray-500">
                A fixed fee PackMyCode charges to the buyer.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-3">
              <div className="font-medium">
                Author fee $
                {
                  calculateEarnings(
                    calculatorInput,
                    earningModalType === "regular" ? regularBuyerFee : extendedBuyerFee
                  ).totalFees
                }
              </div>
              <p className="text-sm text-gray-500">
                A percentage fee for authors based on your lifetime earnings.
              </p>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>
                Tax information for{" "}
                <a href="#" className="text-primary hover:underline">
                  non-US authors
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  US authors
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </Form>
  );
}
