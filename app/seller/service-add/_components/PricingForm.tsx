"use client";

import { useState, useEffect } from "react";
import { Form, Input, Select, Button, Switch, Card } from "antd";
import toast from "react-hot-toast";
import { ServiceDraft, PackageData } from "../page";
import { useSaveServiceSecondStepMutation } from "@/state/services/seller-service/service.service";

interface PricingFormProps {
  draft: ServiceDraft;
  onNext: (data: Partial<ServiceDraft>) => void;
  onBack: () => void;
  updateDraft: (data: Partial<ServiceDraft>) => void;
}

const deliveryTimeOptions = [
  { value: 1, label: "1 Day" },
  { value: 2, label: "2 Days" },
  { value: 3, label: "3 Days" },
  { value: 4, label: "4 Days" },
  { value: 5, label: "5 Days" },
  { value: 6, label: "6 Days" },
  { value: 7, label: "7 Days" },
  { value: 14, label: "14 Days" },
  { value: 21, label: "21 Days" },
  { value: 30, label: "30 Days" },
  { value: 45, label: "45 Days" },
  { value: 60, label: "60 Days" },
  { value: 90, label: "90 Days" },
];

const defaultPackage: PackageData = {
  title: "",
  short_description: "",
  price: 0,
  delivery_time: 3,
  attributes: [],
};

export default function PricingForm({ draft, onNext, onBack, updateDraft }: PricingFormProps) {
  const [form] = Form.useForm();
  const [offerPackages, setOfferPackages] = useState(draft.is_offer_packages ?? false);

  const [saveSecondStep, { isLoading }] = useSaveServiceSecondStepMutation();

  // Set initial form values from draft
  useEffect(() => {
    if (draft.basic) {
      form.setFieldsValue({
        basic_title: draft.basic.title,
        basic_description: draft.basic.short_description,
        basic_price: draft.basic.price,
        basic_delivery: draft.basic.delivery_time,
        standard_title: draft.standard?.title,
        standard_description: draft.standard?.short_description,
        standard_price: draft.standard?.price,
        standard_delivery: draft.standard?.delivery_time,
        premium_title: draft.premium?.title,
        premium_description: draft.premium?.short_description,
        premium_price: draft.premium?.price,
        premium_delivery: draft.premium?.delivery_time,
      });
    }
  }, [draft, form]);

  const onFinish = async (values: any) => {
    const basic: PackageData = {
      title: values.basic_title || "Basic",
      short_description: values.basic_description,
      price: Number(values.basic_price),
      delivery_time: values.basic_delivery,
      attributes: [],
    };

    const standard: PackageData = offerPackages
      ? {
          title: values.standard_title || "Standard",
          short_description: values.standard_description,
          price: Number(values.standard_price),
          delivery_time: values.standard_delivery,
          attributes: [],
        }
      : defaultPackage;

    const premium: PackageData = offerPackages
      ? {
          title: values.premium_title || "Premium",
          short_description: values.premium_description,
          price: Number(values.premium_price),
          delivery_time: values.premium_delivery,
          attributes: [],
        }
      : defaultPackage;

    const payload = {
      id: draft.id,
      is_offer_packages: offerPackages,
      basic,
      standard,
      premium,
    };

    try {
      const result = await saveSecondStep(payload).unwrap();

      if (result?.statusCode === 200 || result?.data) {
        toast.success("Pricing saved successfully");
        onNext({
          is_offer_packages: offerPackages,
          basic,
          standard: offerPackages ? standard : undefined,
          premium: offerPackages ? premium : undefined,
        });
      } else {
        toast.error(result?.message || "Failed to save pricing");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save pricing");
    }
  };

  const PackageColumn = ({
    tier,
    label,
    required = false,
    placeholder,
  }: {
    tier: "basic" | "standard" | "premium";
    label: string;
    required?: boolean;
    placeholder: { price: string };
  }) => (
    <div className="flex-1 min-w-0">
      <div className={`p-4 rounded-lg ${tier === "standard" ? "bg-primary/5 border-2 border-primary" : "bg-gray-50"}`}>
        <h4 className="font-semibold text-center mb-4 text-lg">
          {label}
          {tier === "standard" && <span className="text-xs text-primary block">Most Popular</span>}
        </h4>

        <div className="space-y-4">
          {/* Package Title */}
          <Form.Item
            name={`${tier}_title`}
            label={<span className="text-sm font-medium">Package Name</span>}
            rules={required ? [{ required: true, message: "Required" }] : []}
          >
            <Input placeholder={label} size="large" />
          </Form.Item>

          {/* Short Description */}
          <Form.Item
            name={`${tier}_description`}
            label={<span className="text-sm font-medium">Description</span>}
            rules={
              required
                ? [
                    { required: true, message: "Required" },
                    { min: 20, message: "Min 20 characters" },
                    { max: 200, message: "Max 200 characters" },
                  ]
                : []
            }
          >
            <Input.TextArea
              placeholder="Describe what's included in this package"
              rows={3}
              showCount
              maxLength={200}
            />
          </Form.Item>

          {/* Delivery Time */}
          <Form.Item
            name={`${tier}_delivery`}
            label={<span className="text-sm font-medium">Delivery Time</span>}
            rules={required ? [{ required: true, message: "Required" }] : []}
            initialValue={3}
          >
            <Select options={deliveryTimeOptions} size="large" />
          </Form.Item>

          {/* Price */}
          <Form.Item
            name={`${tier}_price`}
            label={<span className="text-sm font-medium">Price ($)</span>}
            rules={
              required
                ? [
                    { required: true, message: "Required" },
                    {
                      validator: (_, value) =>
                        value && Number(value) >= 5
                          ? Promise.resolve()
                          : Promise.reject("Min $5"),
                    },
                  ]
                : []
            }
          >
            <Input
              type="number"
              placeholder={placeholder.price}
              size="large"
              prefix="$"
              min={5}
              max={10000}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <div className="space-y-6">
        {/* Package Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-semibold text-gray-900">Offer Packages</h3>
            <p className="text-sm text-gray-500">
              Enable to offer Basic, Standard, and Premium packages
            </p>
          </div>
          <Switch checked={offerPackages} onChange={setOfferPackages} />
        </div>

        {/* Pricing Columns */}
        <div className={`flex gap-4 ${offerPackages ? "flex-col md:flex-row" : ""}`}>
          {/* Basic Package - Always shown */}
          <PackageColumn
            tier="basic"
            label="Basic"
            required={true}
            placeholder={{ price: "29" }}
          />

          {/* Standard & Premium - Only when packages enabled */}
          {offerPackages && (
            <>
              <PackageColumn
                tier="standard"
                label="Standard"
                required={true}
                placeholder={{ price: "59" }}
              />
              <PackageColumn
                tier="premium"
                label="Premium"
                required={true}
                placeholder={{ price: "99" }}
              />
            </>
          )}
        </div>

        {/* Package Attributes Info */}
        <Card className="bg-blue-50 border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Package Attributes</h4>
          <p className="text-sm text-blue-700">
            Additional package attributes (like revisions, source files, etc.) will be available
            based on your service category. These help buyers compare your packages.
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <Button size="large" onClick={onBack}>
            Previous
          </Button>
          <Button type="primary" htmlType="submit" size="large" loading={isLoading}>
            Save & Continue
          </Button>
        </div>
      </div>
    </Form>
  );
}
